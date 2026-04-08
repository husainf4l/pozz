using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PozzBackend.Common.Infrastructure.Authorization;
using PozzBackend.Modules.Investors.Application.DTOs;
using PozzBackend.Modules.Investors.Application.Services;

namespace PozzBackend.Modules.Investors.Presentation;

[ApiController]
[Authorize]
[Route("api/investors")]
public class InvestorsController : ControllerBase
{
    private readonly IInvestorService _investorService;
    public InvestorsController(IInvestorService investorService) => _investorService = investorService;

    [HttpGet]
    [HasPermission(PermissionConstants.Investors.Read)]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] long? companyId = null,
        CancellationToken ct = default)
    {
        var result = await _investorService.GetAllAsync(page, pageSize, companyId, ct);
        return Ok(result.Data);
    }

    [HttpGet("search")]
    [HasPermission(PermissionConstants.Investors.Read)]
    public async Task<IActionResult> Search([FromQuery] InvestorSearchRequest request, CancellationToken ct)
    {
        var result = await _investorService.SearchAsync(request, ct);
        return Ok(result.Data);
    }

    [HttpGet("{id:long}")]
    [HasPermission(PermissionConstants.Investors.Read)]
    public async Task<IActionResult> GetById(long id, CancellationToken ct)
    {
        var result = await _investorService.GetByIdAsync(id, ct);
        return result.IsSuccess ? Ok(result.Data) : NotFound(new { error = result.Error });
    }

    [HttpGet("by-user/{userId:long}")]
    [HasPermission(PermissionConstants.Investors.Read)]
    public async Task<IActionResult> GetByUserId(long userId, CancellationToken ct)
    {
        var result = await _investorService.GetByUserIdAsync(userId, ct);
        return result.IsSuccess ? Ok(result.Data) : NotFound(new { error = result.Error });
    }

    [HttpPost]
    [HasPermission(PermissionConstants.Investors.Create)]
    public async Task<IActionResult> Create([FromBody] CreateInvestorRequest request, CancellationToken ct)
    {
        var result = await _investorService.CreateAsync(request, ct);
        return result.IsSuccess
            ? StatusCode(201, result.Data)
            : StatusCode(result.StatusCode, new { error = result.Error });
    }

    [HttpPut("{id:long}")]
    [HasPermission(PermissionConstants.Investors.Update)]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateInvestorRequest request, CancellationToken ct)
    {
        var result = await _investorService.UpdateAsync(id, request, ct);
        return result.IsSuccess
            ? Ok(result.Data)
            : StatusCode(result.StatusCode, new { error = result.Error });
    }

    [HttpDelete("{id:long}")]
    [HasPermission(PermissionConstants.Investors.Delete)]
    public async Task<IActionResult> Delete(long id, CancellationToken ct)
    {
        var result = await _investorService.DeleteAsync(id, ct);
        return result.IsSuccess ? NoContent() : StatusCode(result.StatusCode, new { error = result.Error });
    }
}
