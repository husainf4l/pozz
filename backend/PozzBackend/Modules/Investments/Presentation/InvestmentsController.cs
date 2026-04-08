using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PozzBackend.Common.Infrastructure.Authorization;
using PozzBackend.Modules.Investments.Application.DTOs;
using PozzBackend.Modules.Investments.Application.Services;

namespace PozzBackend.Modules.Investments.Presentation;

[ApiController]
[Authorize]
[Route("api/investments")]
public class InvestmentsController : ControllerBase
{
    private readonly IInvestmentService _investmentService;
    
    public InvestmentsController(IInvestmentService investmentService)
    {
        _investmentService = investmentService;
    }
    
    [HttpGet]
    [HasPermission(PermissionConstants.Investments.Read)]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] long? companyId = null,
        CancellationToken ct = default)
    {
        var result = await _investmentService.GetAllAsync(page, pageSize, companyId, ct);
        return Ok(result.Data);
    }
    
    [HttpGet("search")]
    [HasPermission(PermissionConstants.Investments.Read)]
    public async Task<IActionResult> Search([FromQuery] InvestmentSearchRequest request, CancellationToken ct)
    {
        var result = await _investmentService.SearchAsync(request, ct);
        return Ok(result.Data);
    }
    
    [HttpGet("{id:long}")]
    [HasPermission(PermissionConstants.Investments.Read)]
    public async Task<IActionResult> GetById(long id, CancellationToken ct)
    {
        var result = await _investmentService.GetByIdAsync(id, ct);
        return result.IsSuccess ? Ok(result.Data) : NotFound(new { error = result.Error });
    }
    
    [HttpGet("by-investor/{investorId:long}")]
    [HasPermission(PermissionConstants.Investments.Read)]
    public async Task<IActionResult> GetByInvestorId(
        long investorId, 
        [FromQuery] int page = 1, 
        [FromQuery] int pageSize = 20, 
        CancellationToken ct = default)
    {
        var result = await _investmentService.GetByInvestorIdAsync(investorId, page, pageSize, ct);
        return Ok(result.Data);
    }
    
    [HttpGet("by-project/{projectId:long}")]
    [HasPermission(PermissionConstants.Investments.Read)]
    public async Task<IActionResult> GetByProjectId(
        long projectId, 
        [FromQuery] int page = 1, 
        [FromQuery] int pageSize = 20, 
        CancellationToken ct = default)
    {
        var result = await _investmentService.GetByProjectIdAsync(projectId, page, pageSize, ct);
        return Ok(result.Data);
    }
    
    [HttpGet("total-raised")]
    [HasPermission(PermissionConstants.Investments.Read)]
    public async Task<IActionResult> GetTotalRaised([FromQuery] long companyId, CancellationToken ct)
    {
        var result = await _investmentService.GetTotalRaisedAsync(companyId, ct);
        return Ok(new { totalRaised = result.Data });
    }
    
    [HttpPost]
    [HasPermission(PermissionConstants.Investments.Create)]
    public async Task<IActionResult> Create([FromBody] CreateInvestmentRequest request, CancellationToken ct)
    {
        var result = await _investmentService.CreateAsync(request, ct);
        return result.IsSuccess
            ? StatusCode(201, result.Data)
            : StatusCode(result.StatusCode, new { error = result.Error });
    }
    
    [HttpPut("{id:long}")]
    [HasPermission(PermissionConstants.Investments.Update)]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateInvestmentRequest request, CancellationToken ct)
    {
        var result = await _investmentService.UpdateAsync(id, request, ct);
        return result.IsSuccess
            ? Ok(result.Data)
            : StatusCode(result.StatusCode, new { error = result.Error });
    }
    
    [HttpDelete("{id:long}")]
    [HasPermission(PermissionConstants.Investments.Delete)]
    public async Task<IActionResult> Delete(long id, CancellationToken ct)
    {
        var result = await _investmentService.DeleteAsync(id, ct);
        return result.IsSuccess ? NoContent() : StatusCode(result.StatusCode, new { error = result.Error });
    }
}
