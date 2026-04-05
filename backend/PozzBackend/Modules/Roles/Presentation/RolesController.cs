using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PozzBackend.Common.Infrastructure.Authorization;
using PozzBackend.Modules.Roles.Application.DTOs;
using PozzBackend.Modules.Roles.Application.Services;

namespace PozzBackend.Modules.Roles.Presentation;

[ApiController]
[Authorize]
[Route("api/roles")]
public class RolesController : ControllerBase
{
    private readonly IRoleService _roleService;
    public RolesController(IRoleService roleService) => _roleService = roleService;

    [HttpGet]
    [HasPermission(PermissionConstants.Roles.Read)]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        var result = await _roleService.GetAllAsync(ct);
        return Ok(result.Data);
    }

    [HttpGet("{id:long}")]
    [HasPermission(PermissionConstants.Roles.Read)]
    public async Task<IActionResult> GetById(long id, CancellationToken ct)
    {
        var result = await _roleService.GetByIdAsync(id, ct);
        return result.IsSuccess ? Ok(result.Data) : NotFound(new { error = result.Error });
    }

    [HttpPost]
    [HasPermission(PermissionConstants.Roles.Create)]
    public async Task<IActionResult> Create([FromBody] CreateRoleRequest request, CancellationToken ct)
    {
        var result = await _roleService.CreateAsync(request, ct);
        return result.IsSuccess
            ? StatusCode(201, result.Data)
            : StatusCode(result.StatusCode, new { error = result.Error });
    }

    [HttpPut("{id:long}")]
    [HasPermission(PermissionConstants.Roles.Update)]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateRoleRequest request, CancellationToken ct)
    {
        var result = await _roleService.UpdateAsync(id, request, ct);
        return result.IsSuccess
            ? Ok(result.Data)
            : StatusCode(result.StatusCode, new { error = result.Error });
    }

    [HttpDelete("{id:long}")]
    [HasPermission(PermissionConstants.Roles.Delete)]
    public async Task<IActionResult> Delete(long id, CancellationToken ct)
    {
        var result = await _roleService.DeleteAsync(id, ct);
        return result.IsSuccess ? NoContent() : StatusCode(result.StatusCode, new { error = result.Error });
    }

    [HttpPost("{id:long}/permissions")]
    [HasPermission(PermissionConstants.Roles.ManagePermissions)]
    public async Task<IActionResult> AssignPermissions(
        long id, [FromBody] AssignPermissionsRequest request, CancellationToken ct)
    {
        var result = await _roleService.AssignPermissionsAsync(id, request.Permissions, ct);
        return result.IsSuccess
            ? Ok(new { message = "Permissions assigned." })
            : StatusCode(result.StatusCode, new { error = result.Error });
    }

    [HttpDelete("{id:long}/permissions/{permission}")]
    [HasPermission(PermissionConstants.Roles.ManagePermissions)]
    public async Task<IActionResult> RemovePermission(long id, string permission, CancellationToken ct)
    {
        var result = await _roleService.RemovePermissionAsync(id, permission, ct);
        return result.IsSuccess ? NoContent() : StatusCode(result.StatusCode, new { error = result.Error });
    }
}
