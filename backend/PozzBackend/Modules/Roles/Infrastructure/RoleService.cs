using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PozzBackend.Common.Application;
using PozzBackend.Common.Infrastructure;
using PozzBackend.Modules.Auth.Domain;
using PozzBackend.Modules.Roles.Application.DTOs;
using PozzBackend.Modules.Roles.Application.Services;

namespace PozzBackend.Modules.Roles.Infrastructure;

public class RoleService : IRoleService
{
    private readonly RoleManager<ApplicationRole> _roleManager;
    private readonly ApplicationDbContext _db;

    public RoleService(RoleManager<ApplicationRole> roleManager, ApplicationDbContext db)
    {
        _roleManager = roleManager;
        _db = db;
    }

    public async Task<Result<IEnumerable<RoleDto>>> GetAllAsync(CancellationToken ct = default)
    {
        var roles = await _db.Roles
            .Include(r => r.RolePermissions)
                .ThenInclude(rp => rp.Permission)
            .ToListAsync(ct);

        var dtos = roles.Select(MapToDto);
        return Result<IEnumerable<RoleDto>>.Success(dtos);
    }

    public async Task<Result<RoleDto>> GetByIdAsync(long id, CancellationToken ct = default)
    {
        var role = await _db.Roles
            .Include(r => r.RolePermissions)
                .ThenInclude(rp => rp.Permission)
            .FirstOrDefaultAsync(r => r.Id == id, ct);

        return role is null
            ? Result<RoleDto>.NotFound($"Role {id} not found.")
            : Result<RoleDto>.Success(MapToDto(role));
    }

    public async Task<Result<RoleDto>> CreateAsync(CreateRoleRequest request, CancellationToken ct = default)
    {
        if (await _roleManager.RoleExistsAsync(request.Name))
            return Result<RoleDto>.Conflict($"Role '{request.Name}' already exists.");

        var role = new ApplicationRole(request.Name) { Description = request.Description };
        var result = await _roleManager.CreateAsync(role);
        if (!result.Succeeded)
            return Result<RoleDto>.Failure(string.Join("; ", result.Errors.Select(e => e.Description)));

        return Result<RoleDto>.Created(MapToDto(role));
    }

    public async Task<Result<RoleDto>> UpdateAsync(long id, UpdateRoleRequest request, CancellationToken ct = default)
    {
        var role = await _db.Roles
            .Include(r => r.RolePermissions).ThenInclude(rp => rp.Permission)
            .FirstOrDefaultAsync(r => r.Id == id, ct);

        if (role is null) return Result<RoleDto>.NotFound($"Role {id} not found.");

        role.Name = request.Name;
        role.NormalizedName = request.Name.ToUpperInvariant();
        role.Description = request.Description;

        var result = await _roleManager.UpdateAsync(role);
        return result.Succeeded
            ? Result<RoleDto>.Success(MapToDto(role))
            : Result<RoleDto>.Failure(string.Join("; ", result.Errors.Select(e => e.Description)));
    }

    public async Task<Result<bool>> DeleteAsync(long id, CancellationToken ct = default)
    {
        var role = await _roleManager.FindByIdAsync(id.ToString());
        if (role is null) return Result<bool>.NotFound($"Role {id} not found.");

        var result = await _roleManager.DeleteAsync(role);
        return result.Succeeded
            ? Result<bool>.Success(true)
            : Result<bool>.Failure(string.Join("; ", result.Errors.Select(e => e.Description)));
    }

    public async Task<Result<bool>> AssignPermissionsAsync(
        long id, IList<string> permissions, CancellationToken ct = default)
    {
        var role = await _db.Roles
            .Include(r => r.RolePermissions)
            .FirstOrDefaultAsync(r => r.Id == id, ct);

        if (role is null) return Result<bool>.NotFound($"Role {id} not found.");

        var permEntities = await _db.Permissions
            .Where(p => permissions.Contains(p.Name))
            .ToListAsync(ct);

        var missing = permissions.Except(permEntities.Select(p => p.Name)).ToList();
        if (missing.Count > 0)
            return Result<bool>.Failure($"Unknown permissions: {string.Join(", ", missing)}");

        foreach (var perm in permEntities)
        {
            if (!role.RolePermissions.Any(rp => rp.PermissionId == perm.Id))
                _db.RolePermissions.Add(new RolePermission { RoleId = id, PermissionId = perm.Id });
        }

        await _db.SaveChangesAsync(ct);
        return Result<bool>.Success(true);
    }

    public async Task<Result<bool>> RemovePermissionAsync(
        long id, string permission, CancellationToken ct = default)
    {
        var perm = await _db.Permissions.FirstOrDefaultAsync(p => p.Name == permission, ct);
        if (perm is null) return Result<bool>.NotFound($"Permission '{permission}' not found.");

        var rp = await _db.RolePermissions
            .FirstOrDefaultAsync(rp => rp.RoleId == id && rp.PermissionId == perm.Id, ct);

        if (rp is null) return Result<bool>.NotFound("Role does not have this permission.");

        _db.RolePermissions.Remove(rp);
        await _db.SaveChangesAsync(ct);
        return Result<bool>.Success(true);
    }

    private static RoleDto MapToDto(ApplicationRole r) => new(
        r.Id,
        r.Name!,
        r.Description,
        r.RolePermissions.Select(rp => rp.Permission.Name).ToList());
}
