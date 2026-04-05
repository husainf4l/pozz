using PozzBackend.Common.Application;
using PozzBackend.Modules.Users.Application.DTOs;

namespace PozzBackend.Modules.Users.Application.Services;

public interface IUserService
{
    Task<Result<PagedResult<UserDto>>> GetAllAsync(int page, int pageSize, CancellationToken ct = default);
    Task<Result<UserDto>> GetByIdAsync(long id, CancellationToken ct = default);
    Task<Result<UserDto>> UpdateAsync(long id, UpdateUserRequest request, CancellationToken ct = default);
    Task<Result<bool>> DeleteAsync(long id, CancellationToken ct = default);
    Task<Result<IList<string>>> GetRolesAsync(long id, CancellationToken ct = default);
    Task<Result<bool>> AssignRoleAsync(long id, string roleName, CancellationToken ct = default);
    Task<Result<bool>> RemoveRoleAsync(long id, string roleName, CancellationToken ct = default);
}
