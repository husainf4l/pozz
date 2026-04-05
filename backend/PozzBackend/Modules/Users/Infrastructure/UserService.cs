using Microsoft.AspNetCore.Identity;
using PozzBackend.Common.Application;
using PozzBackend.Modules.Auth.Domain;
using PozzBackend.Modules.Users.Application.DTOs;
using PozzBackend.Modules.Users.Application.Services;
using PozzBackend.Modules.Users.Domain;

namespace PozzBackend.Modules.Users.Infrastructure;

public class UserService : IUserService
{
    private readonly IUserRepository _repo;
    private readonly UserManager<ApplicationUser> _userManager;

    public UserService(IUserRepository repo, UserManager<ApplicationUser> userManager)
    {
        _repo = repo;
        _userManager = userManager;
    }

    public async Task<Result<PagedResult<UserDto>>> GetAllAsync(
        int page, int pageSize, CancellationToken ct = default)
    {
        var (items, total) = await _repo.GetAllAsync(page, pageSize, ct);
        var dtos = new List<UserDto>();
        foreach (var user in items)
        {
            var roles = await _userManager.GetRolesAsync(user);
            dtos.Add(MapToDto(user, roles));
        }
        return Result<PagedResult<UserDto>>.Success(new PagedResult<UserDto>(dtos, total, page, pageSize));
    }

    public async Task<Result<UserDto>> GetByIdAsync(long id, CancellationToken ct = default)
    {
        var user = await _repo.GetByIdAsync(id, ct);
        if (user is null) return Result<UserDto>.NotFound($"User {id} not found.");
        var roles = await _userManager.GetRolesAsync(user);
        return Result<UserDto>.Success(MapToDto(user, roles));
    }

    public async Task<Result<UserDto>> UpdateAsync(long id, UpdateUserRequest request, CancellationToken ct = default)
    {
        var user = await _repo.GetByIdAsync(id, ct);
        if (user is null) return Result<UserDto>.NotFound($"User {id} not found.");

        user.FirstName = request.FirstName;
        user.LastName = request.LastName;
        user.IsActive = request.IsActive;
        user.UpdatedAt = DateTimeOffset.UtcNow;

        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
            return Result<UserDto>.Failure(string.Join("; ", result.Errors.Select(e => e.Description)));

        var roles = await _userManager.GetRolesAsync(user);
        return Result<UserDto>.Success(MapToDto(user, roles));
    }

    public async Task<Result<bool>> DeleteAsync(long id, CancellationToken ct = default)
    {
        var user = await _repo.GetByIdAsync(id, ct);
        if (user is null) return Result<bool>.NotFound($"User {id} not found.");

        user.IsActive = false;
        user.UpdatedAt = DateTimeOffset.UtcNow;
        await _userManager.UpdateAsync(user);
        return Result<bool>.Success(true);
    }

    public async Task<Result<IList<string>>> GetRolesAsync(long id, CancellationToken ct = default)
    {
        var user = await _repo.GetByIdAsync(id, ct);
        if (user is null) return Result<IList<string>>.NotFound($"User {id} not found.");
        var roles = await _userManager.GetRolesAsync(user);
        return Result<IList<string>>.Success(roles);
    }

    public async Task<Result<bool>> AssignRoleAsync(long id, string roleName, CancellationToken ct = default)
    {
        var user = await _repo.GetByIdAsync(id, ct);
        if (user is null) return Result<bool>.NotFound($"User {id} not found.");

        if (await _userManager.IsInRoleAsync(user, roleName))
            return Result<bool>.Conflict($"User already has role '{roleName}'.");

        var result = await _userManager.AddToRoleAsync(user, roleName);
        return result.Succeeded
            ? Result<bool>.Success(true)
            : Result<bool>.Failure(string.Join("; ", result.Errors.Select(e => e.Description)));
    }

    public async Task<Result<bool>> RemoveRoleAsync(long id, string roleName, CancellationToken ct = default)
    {
        var user = await _repo.GetByIdAsync(id, ct);
        if (user is null) return Result<bool>.NotFound($"User {id} not found.");

        var result = await _userManager.RemoveFromRoleAsync(user, roleName);
        return result.Succeeded
            ? Result<bool>.Success(true)
            : Result<bool>.Failure(string.Join("; ", result.Errors.Select(e => e.Description)));
    }

    private static UserDto MapToDto(ApplicationUser u, IList<string> roles) => new(
        u.Id, u.Email!, u.FirstName, u.LastName, u.IsActive, roles, u.CreatedAt, u.UpdatedAt);
}
