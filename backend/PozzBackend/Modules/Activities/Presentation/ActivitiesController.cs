using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PozzBackend.Common.Infrastructure.Authorization;
using PozzBackend.Modules.Activities.Application;

namespace PozzBackend.Modules.Activities.Presentation;

[ApiController]
[Authorize]
[Route("api/activities")]
public class ActivitiesController : ControllerBase
{
    private readonly IActivityService _activityService;

    public ActivitiesController(IActivityService activityService)
    {
        _activityService = activityService;
    }

    [HttpGet]
    [HasPermission(PermissionConstants.Investments.Read)]
    public async Task<IActionResult> GetAll([FromQuery] long companyId, CancellationToken ct = default)
    {
        var result = await _activityService.GetAllAsync(companyId, ct);
        return Ok(result.Data);
    }

    [HttpGet("search")]
    [HasPermission(PermissionConstants.Investments.Read)]
    public async Task<IActionResult> Search([FromQuery] ActivitySearchRequest request, CancellationToken ct)
    {
        var result = await _activityService.SearchAsync(request, ct);
        return Ok(result.Data);
    }

    [HttpGet("{id:long}")]
    [HasPermission(PermissionConstants.Investments.Read)]
    public async Task<IActionResult> GetById(long id, CancellationToken ct)
    {
        var result = await _activityService.GetByIdAsync(id, ct);
        return result.IsSuccess ? Ok(result.Data) : NotFound(new { error = result.Error });
    }

    [HttpGet("by-investor/{investorId:long}")]
    [HasPermission(PermissionConstants.Investments.Read)]
    public async Task<IActionResult> GetByInvestorId(long investorId, CancellationToken ct = default)
    {
        var result = await _activityService.GetByInvestorIdAsync(investorId, ct);
        return Ok(result.Data);
    }

    [HttpGet("by-investment/{investmentId:long}")]
    [HasPermission(PermissionConstants.Investments.Read)]
    public async Task<IActionResult> GetByInvestmentId(long investmentId, CancellationToken ct = default)
    {
        var result = await _activityService.GetByInvestmentIdAsync(investmentId, ct);
        return Ok(result.Data);
    }

    [HttpGet("by-project/{projectId:long}")]
    [HasPermission(PermissionConstants.Investments.Read)]
    public async Task<IActionResult> GetByProjectId(long projectId, CancellationToken ct = default)
    {
        var result = await _activityService.GetByProjectIdAsync(projectId, ct);
        return Ok(result.Data);
    }

    [HttpPost]
    [HasPermission(PermissionConstants.Investments.Create)]
    public async Task<IActionResult> Create([FromBody] CreateActivityRequest request, CancellationToken ct)
    {
        var userId = long.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var companyId = long.Parse(User.FindFirst("CompanyId")?.Value ?? "1");
        
        var result = await _activityService.CreateAsync(request, userId, companyId, ct);
        return result.IsSuccess
            ? StatusCode(201, result.Data)
            : StatusCode(result.StatusCode, new { error = result.Error });
    }

    [HttpPut("{id:long}")]
    [HasPermission(PermissionConstants.Investments.Update)]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateActivityRequest request, CancellationToken ct)
    {
        var userId = long.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        
        var result = await _activityService.UpdateAsync(id, request, userId, ct);
        return result.IsSuccess
            ? Ok(result.Data)
            : StatusCode(result.StatusCode, new { error = result.Error });
    }

    [HttpDelete("{id:long}")]
    [HasPermission(PermissionConstants.Investments.Delete)]
    public async Task<IActionResult> Delete(long id, CancellationToken ct)
    {
        var result = await _activityService.DeleteAsync(id, ct);
        return result.IsSuccess
            ? NoContent()
            : StatusCode(result.StatusCode, new { error = result.Error });
    }
}
