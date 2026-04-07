using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PozzBackend.Common.Infrastructure.Authorization;
using PozzBackend.Modules.Projects.Application.DTOs;
using PozzBackend.Modules.Projects.Application.Services;
using System.Security.Claims;

namespace PozzBackend.Modules.Projects.Presentation;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProjectsController : ControllerBase
{
    private readonly IProjectService _projectService;

    public ProjectsController(IProjectService projectService)
    {
        _projectService = projectService;
    }

    /// <summary>Get all projects (public endpoint)</summary>
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        var result = await _projectService.GetAllProjectsAsync(ct);
        return Ok(result.Data);
    }

    /// <summary>Get active projects only</summary>
    [HttpGet("active")]
    [AllowAnonymous]
    public async Task<IActionResult> GetActive(CancellationToken ct)
    {
        var result = await _projectService.GetActiveProjectsAsync(ct);
        return Ok(result.Data);
    }

    /// <summary>Get my projects (ProjectOwner only)</summary>
    [HttpGet("my-projects")]
    [HasPermission(PermissionConstants.Projects.Read)]
    public async Task<IActionResult> GetMyProjects(CancellationToken ct)
    {
        var userId = GetUserId();
        if (userId is null) return Unauthorized();

        var result = await _projectService.GetMyProjectsAsync(userId.Value, ct);
        return Ok(result.Data);
    }

    /// <summary>Get project by ID</summary>
    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(long id, CancellationToken ct)
    {
        var result = await _projectService.GetProjectByIdAsync(id, ct);
        return result.IsSuccess ? Ok(result.Data) : StatusCode(result.StatusCode, new { error = result.Error });
    }

    /// <summary>Create new project (ProjectOwner only)</summary>
    [HttpPost]
    [HasPermission(PermissionConstants.Projects.Create)]
    public async Task<IActionResult> Create([FromBody] CreateProjectRequest request, CancellationToken ct)
    {
        var userId = GetUserId();
        if (userId is null) return Unauthorized();

        var result = await _projectService.CreateProjectAsync(userId.Value, request, ct);
        return result.IsSuccess ? Ok(result.Data) : StatusCode(result.StatusCode, new { error = result.Error });
    }

    /// <summary>Update project (ProjectOwner only)</summary>
    [HttpPut("{id}")]
    [HasPermission(PermissionConstants.Projects.Update)]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateProjectRequest request, CancellationToken ct)
    {
        var userId = GetUserId();
        if (userId is null) return Unauthorized();

        var result = await _projectService.UpdateProjectAsync(userId.Value, id, request, ct);
        return result.IsSuccess ? Ok(result.Data) : StatusCode(result.StatusCode, new { error = result.Error });
    }

    /// <summary>Delete project (ProjectOwner only)</summary>
    [HttpDelete("{id}")]
    [HasPermission(PermissionConstants.Projects.Delete)]
    public async Task<IActionResult> Delete(long id, CancellationToken ct)
    {
        var userId = GetUserId();
        if (userId is null) return Unauthorized();

        var result = await _projectService.DeleteProjectAsync(userId.Value, id, ct);
        return result.IsSuccess ? Ok() : StatusCode(result.StatusCode, new { error = result.Error });
    }

    private long? GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier);
        return claim is not null && long.TryParse(claim.Value, out var id) ? id : null;
    }
}
