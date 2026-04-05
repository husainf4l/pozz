using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PozzBackend.Common.Application;
using PozzBackend.Common.Infrastructure;
using PozzBackend.Modules.Auth.Application.DTOs;
using PozzBackend.Modules.Auth.Application.Services;
using PozzBackend.Modules.Auth.Domain;
using PozzBackend.Modules.Onboarding.Domain;

namespace PozzBackend.Modules.Auth.Infrastructure;

public class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ApplicationDbContext _db;
    private readonly IConfiguration _config;

    public AuthService(
        UserManager<ApplicationUser> userManager,
        ApplicationDbContext db,
        IConfiguration config)
    {
        _userManager = userManager;
        _db = db;
        _config = config;
    }

    // ── Register ───────────────────────────────────────────────────────────
    public async Task<Result<AuthResponse>> RegisterAsync(RegisterRequest request, CancellationToken ct = default)
    {
        if (await _userManager.FindByEmailAsync(request.Email) is not null)
            return Result<AuthResponse>.Conflict("Email is already registered.");

        // Only Investor and ProjectOwner roles are available via self-registration
        var allowedRoles = new[] { "Investor", "ProjectOwner" };
        var roleName = request.Role ?? "Investor";
        if (!allowedRoles.Contains(roleName))
            return Result<AuthResponse>.Failure($"Role must be one of: {string.Join(", ", allowedRoles)}");

        var user = new ApplicationUser
        {
            UserName = request.Email,
            Email = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName,
            EmailConfirmed = true
        };

        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
        {
            var errors = string.Join("; ", result.Errors.Select(e => e.Description));
            return Result<AuthResponse>.Failure(errors);
        }

        await _userManager.AddToRoleAsync(user, roleName);

        // Create onboarding record for the user
        var onboardingRole = roleName == "Investor" ? OnboardingRole.Investor : OnboardingRole.ProjectOwner;
        _db.UserOnboardings.Add(new UserOnboarding
        {
            UserId = user.Id,
            OnboardingRole = onboardingRole,
            Status = OnboardingStatus.NotStarted,
            CompletedSteps = []
        });
        await _db.SaveChangesAsync(ct);

        return await BuildAuthResponseAsync(user, ct);
    }

    // ── Login ──────────────────────────────────────────────────────────────
    public async Task<Result<AuthResponse>> LoginAsync(LoginRequest request, CancellationToken ct = default)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user is null || !user.IsActive)
            return Result<AuthResponse>.Unauthorized("Invalid credentials.");

        if (!await _userManager.CheckPasswordAsync(user, request.Password))
            return Result<AuthResponse>.Unauthorized("Invalid credentials.");

        return await BuildAuthResponseAsync(user, ct);
    }

    // ── Refresh ────────────────────────────────────────────────────────────
    public async Task<Result<AuthResponse>> RefreshTokenAsync(string refreshToken, CancellationToken ct = default)
    {
        var stored = await _db.RefreshTokens
            .Include(rt => rt.User)
            .FirstOrDefaultAsync(rt => rt.Token == refreshToken, ct);

        if (stored is null || !stored.IsActive)
            return Result<AuthResponse>.Unauthorized("Invalid or expired refresh token.");

        stored.IsRevoked = true;
        await _db.SaveChangesAsync(ct);

        return await BuildAuthResponseAsync(stored.User, ct);
    }

    // ── Revoke ─────────────────────────────────────────────────────────────
    public async Task<Result<bool>> RevokeTokenAsync(string refreshToken, CancellationToken ct = default)
    {
        var stored = await _db.RefreshTokens
            .FirstOrDefaultAsync(rt => rt.Token == refreshToken, ct);

        if (stored is null)
            return Result<bool>.NotFound("Refresh token not found.");

        stored.IsRevoked = true;
        await _db.SaveChangesAsync(ct);
        return Result<bool>.Success(true);
    }

    // ── Private helpers ────────────────────────────────────────────────────
    private async Task<Result<AuthResponse>> BuildAuthResponseAsync(
        ApplicationUser user, CancellationToken ct)
    {
        var roles = await _userManager.GetRolesAsync(user);
        var permissions = await GetPermissionsForRolesAsync(roles.ToList(), ct);

        var (accessToken, expiresAt) = GenerateAccessToken(user, roles, permissions);
        var refreshToken = await GenerateRefreshTokenAsync(user.Id, ct);

        // Build onboarding summary (avoids re-login for frontend redirect decisions)
        var onboarding = await _db.UserOnboardings
            .FirstOrDefaultAsync(o => o.UserId == user.Id, ct);

        var onboardingSummary = onboarding is null
            ? new OnboardingSummaryDto(false, "Unknown", "NotStarted", null, null)
            : new OnboardingSummaryDto(
                onboarding.Status == OnboardingStatus.Completed,
                onboarding.OnboardingRole.ToString(),
                onboarding.Status.ToString(),
                onboarding.GetCurrentStep(),
                onboarding.GetCurrentStep() is { } step
                    ? OnboardingSteps.GetLabel(step)
                    : null);

        var response = new AuthResponse(
            accessToken,
            refreshToken,
            expiresAt,
            new UserInfoDto(user.Id, user.Email!, user.FirstName, user.LastName, roles.ToList()),
            onboardingSummary);

        return Result<AuthResponse>.Success(response);
    }

    private async Task<List<string>> GetPermissionsForRolesAsync(
        IList<string> roleNames, CancellationToken ct)
    {
        var roleIds = await _db.Roles
            .Where(r => roleNames.Contains(r.Name!))
            .Select(r => r.Id)
            .ToListAsync(ct);

        return await _db.RolePermissions
            .Where(rp => roleIds.Contains(rp.RoleId))
            .Select(rp => rp.Permission.Name)
            .Distinct()
            .ToListAsync(ct);
    }

    private (string token, DateTimeOffset expiresAt) GenerateAccessToken(
        ApplicationUser user,
        IList<string> roles,
        IList<string> permissions)
    {
        var jwt = _config.GetSection("JwtSettings");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt["Secret"]!));
        var expiry = DateTimeOffset.UtcNow.AddMinutes(double.Parse(jwt["ExpiryMinutes"]!));

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub,   user.Id.ToString()),
            new(JwtRegisteredClaimNames.Email, user.Email!),
            new(JwtRegisteredClaimNames.GivenName,  user.FirstName),
            new(JwtRegisteredClaimNames.FamilyName, user.LastName),
            new(JwtRegisteredClaimNames.Jti,   Guid.NewGuid().ToString()),
            new(JwtRegisteredClaimNames.Iat,   DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString()),
        };

        claims.AddRange(roles.Select(r => new Claim(ClaimTypes.Role, r)));
        claims.AddRange(permissions.Select(p => new Claim("permission", p)));

        var token = new JwtSecurityToken(
            issuer: jwt["Issuer"],
            audience: jwt["Audience"],
            claims: claims,
            expires: expiry.UtcDateTime,
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256));

        return (new JwtSecurityTokenHandler().WriteToken(token), expiry);
    }

    private async Task<string> GenerateRefreshTokenAsync(long userId, CancellationToken ct)
    {
        var jwt = _config.GetSection("JwtSettings");
        var expiryDays = int.Parse(jwt["RefreshTokenExpiryDays"]!);
        var tokenBytes = RandomNumberGenerator.GetBytes(64);
        var token = Convert.ToBase64String(tokenBytes);

        _db.RefreshTokens.Add(new RefreshToken
        {
            Token = token,
            UserId = userId,
            ExpiresAt = DateTimeOffset.UtcNow.AddDays(expiryDays)
        });
        await _db.SaveChangesAsync(ct);
        return token;
    }
}
