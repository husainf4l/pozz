using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PozzBackend.Common.Infrastructure.Authorization;
using PozzBackend.Modules.Onboarding.Application.DTOs;
using PozzBackend.Modules.Onboarding.Application.Services;

namespace PozzBackend.Modules.Onboarding.Presentation;

[ApiController]
[Authorize]
[Route("api/onboarding")]
public class OnboardingController : ControllerBase
{
    private readonly IOnboardingService _onboardingService;
    public OnboardingController(IOnboardingService onboardingService)
        => _onboardingService = onboardingService;

    // ── GET status ─────────────────────────────────────────────────────────
    /// <summary>
    /// Returns the current onboarding status and step list for the authenticated user.
    /// </summary>
    [HttpGet("status")]
    public async Task<IActionResult> GetStatus(CancellationToken ct)
    {
        var userId = GetUserId();
        if (userId is null) return Unauthorized();

        var result = await _onboardingService.GetStatusAsync(userId.Value, ct);
        return result.IsSuccess ? Ok(result.Data) : StatusCode(result.StatusCode, new { error = result.Error });
    }

    // ── POST personal-info ─────────────────────────────────────────────────
    /// <summary>
    /// Step: personal_info — Applies to all roles. Updates name, phone, date of birth, nationality.
    /// </summary>
    [HttpPost("personal-info")]
    public async Task<IActionResult> CompletePersonalInfo(
        [FromBody] PersonalInfoRequest request, CancellationToken ct)
    {
        var userId = GetUserId();
        if (userId is null) return Unauthorized();

        var result = await _onboardingService.CompletePersonalInfoAsync(userId.Value, request, ct);
        return result.IsSuccess ? Ok(result.Data) : StatusCode(result.StatusCode, new { error = result.Error });
    }

    // ── POST investor-profile ──────────────────────────────────────────────
    /// <summary>
    /// Step: investor_profile — Investor role only. Investment type, budget, and interests.
    /// </summary>
    [HttpPost("investor-profile")]
    [HasPermission(PermissionConstants.Onboarding.Update)]
    public async Task<IActionResult> CompleteInvestorProfile(
        [FromBody] InvestorProfileRequest request, CancellationToken ct)
    {
        var userId = GetUserId();
        if (userId is null) return Unauthorized();

        var result = await _onboardingService.CompleteInvestorProfileAsync(userId.Value, request, ct);
        return result.IsSuccess ? Ok(result.Data) : StatusCode(result.StatusCode, new { error = result.Error });
    }

    // ── POST company-setup ─────────────────────────────────────────────────
    /// <summary>
    /// Step: company_setup — ProjectOwner role only. Creates or updates the owner's company.
    /// </summary>
    [HttpPost("company-setup")]
    [HasPermission(PermissionConstants.Onboarding.Update)]
    public async Task<IActionResult> CompleteCompanySetup(
        [FromBody] CompanySetupRequest request, CancellationToken ct)
    {
        var userId = GetUserId();
        if (userId is null) return Unauthorized();

        var result = await _onboardingService.CompleteCompanySetupAsync(userId.Value, request, ct);
        return result.IsSuccess ? Ok(result.Data) : StatusCode(result.StatusCode, new { error = result.Error });
    }

    // ── POST company-details ───────────────────────────────────────────────
    /// <summary>
    /// Step: company_details — ProjectOwner role only. Enriches the company profile.
    /// </summary>
    [HttpPost("company-details")]
    [HasPermission(PermissionConstants.Onboarding.Update)]
    public async Task<IActionResult> CompleteCompanyDetails(
        [FromBody] CompanyDetailsRequest request, CancellationToken ct)
    {
        var userId = GetUserId();
        if (userId is null) return Unauthorized();

        var result = await _onboardingService.CompleteCompanyDetailsAsync(userId.Value, request, ct);
        return result.IsSuccess ? Ok(result.Data) : StatusCode(result.StatusCode, new { error = result.Error });
    }

    // ── POST terms ─────────────────────────────────────────────────────────
    /// <summary>
    /// Final step: terms_accepted — Applies to all roles. Marks legal agreement.
    /// Completing this marks onboarding as Completed.
    /// </summary>
    [HttpPost("accept-terms")]
    [HasPermission(PermissionConstants.Onboarding.Update)]
    public async Task<IActionResult> AcceptTerms(CancellationToken ct)
    {
        var userId = GetUserId();
        if (userId is null) return Unauthorized();

        var result = await _onboardingService.AcceptTermsAsync(userId.Value, ct);
        return result.IsSuccess ? Ok(result.Data) : StatusCode(result.StatusCode, new { error = result.Error });
    }

    // ── Helper ─────────────────────────────────────────────────────────────
    private long? GetUserId()
    {
        var raw = User.FindFirstValue(ClaimTypes.NameIdentifier)
               ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        return long.TryParse(raw, out var id) ? id : null;
    }
}
