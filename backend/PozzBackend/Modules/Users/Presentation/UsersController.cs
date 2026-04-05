using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PozzBackend.Common.Infrastructure.Authorization;
using PozzBackend.Modules.Users.Application.DTOs;
using PozzBackend.Modules.Users.Application.Services;

namespace PozzBackend.Modules.Users.Presentation;

[ApiController]
[Authorize]
[Route("api/users")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;
    public UsersController(IUserService userService) => _userService = userService;

    [HttpGet]
    [HasPermission(PermissionConstants.Users.Read)]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        var result = await _userService.GetAllAsync(page, pageSize, ct);
        return Ok(result.Data);
    }

    [HttpGet("{id:long}")]
    [HasPermission(PermissionConstants.Users.Read)]
    public async Task<IActionResult> GetById(long id, CancellationToken ct)
    {
        var result = await _userService.GetByIdAsync(id, ct);
        return result.IsSuccess ? Ok(result.Data) : NotFound(new { error = result.Error });
    }

    [HttpPut("{id:long}")]
    [HasPermission(PermissionConstants.Users.Update)]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateUserRequest request, CancellationToken ct)
    {
        var result = await _userService.UpdateAsync(id, request, ct);
        return result.IsSuccess
            ? Ok(result.Data)
            : StatusCode(result.StatusCode, new { error = result.Error });
    }

    [HttpDelete("{id:long}")]
    [HasPermission(PermissionConstants.Users.Delete)]
    public async Task<IActionResult> Delete(long id, CancellationToken ct)
    {
        var result = await _userService.DeleteAsync(id, ct);
        return result.IsSuccess ? NoContent() : StatusCode(result.StatusCode, new { error = result.Error });
    }

    [HttpGet("{id:long}/roles")]
    [HasPermission(PermissionConstants.Users.Read)]
    public async Task<IActionResult> GetRoles(long id, CancellationToken ct)
    {
        var result = await _userService.GetRolesAsync(id, ct);
        return result.IsSuccess ? Ok(result.Data) : NotFound(new { error = result.Error });
    }

    [HttpPost("{id:long}/roles")]
    [HasPermission(PermissionConstants.Users.ManageRoles)]
    public async Task<IActionResult> AssignRole(long id, [FromBody] AssignRoleRequest request, CancellationToken ct)
    {
        var result = await _userService.AssignRoleAsync(id, request.RoleName, ct);
        return result.IsSuccess
            ? Ok(new { message = $"Role '{request.RoleName}' assigned." })
            : StatusCode(result.StatusCode, new { error = result.Error });
    }

    [HttpDelete("{id:long}/roles/{roleName}")]
    [HasPermission(PermissionConstants.Users.ManageRoles)]
    public async Task<IActionResult> RemoveRole(long id, string roleName, CancellationToken ct)
    {
        var result = await _userService.RemoveRoleAsync(id, roleName, ct);
        return result.IsSuccess ? NoContent() : StatusCode(result.StatusCode, new { error = result.Error });
    }
}
