using PozzBackend.Common.Application;
using PozzBackend.Modules.Roles.Application.DTOs;

namespace PozzBackend.Modules.Roles.Application.Services;

public interface IRoleService
{
    Task<Result<IEnumerable<RoleDto>>> GetAllAsync(CancellationToken ct = default);
    Task<Result<RoleDto>> GetByIdAsync(long id, CancellationToken ct = default);
    Task<Result<RoleDto>> CreateAsync(CreateRoleRequest request, CancellationToken ct = default);
    Task<Result<RoleDto>> UpdateAsync(long id, UpdateRoleRequest request, CancellationToken ct = default);
    Task<Result<bool>> DeleteAsync(long id, CancellationToken ct = default);
    Task<Result<bool>> AssignPermissionsAsync(long id, IList<string> permissions, CancellationToken ct = default);
    Task<Result<bool>> RemovePermissionAsync(long id, string permission, CancellationToken ct = default);
}
