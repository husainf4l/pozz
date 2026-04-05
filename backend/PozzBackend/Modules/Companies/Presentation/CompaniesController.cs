using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PozzBackend.Common.Infrastructure.Authorization;
using PozzBackend.Modules.Companies.Application.DTOs;
using PozzBackend.Modules.Companies.Application.Services;

namespace PozzBackend.Modules.Companies.Presentation;

[ApiController]
[Authorize]
[Route("api/companies")]
public class CompaniesController : ControllerBase
{
    private readonly ICompanyService _companyService;
    public CompaniesController(ICompanyService companyService) => _companyService = companyService;

    [HttpGet]
    [HasPermission(PermissionConstants.Companies.Read)]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        var result = await _companyService.GetAllAsync(page, pageSize, ct);
        return Ok(result.Data);
    }

    [HttpGet("{id:long}")]
    [HasPermission(PermissionConstants.Companies.Read)]
    public async Task<IActionResult> GetById(long id, CancellationToken ct)
    {
        var result = await _companyService.GetByIdAsync(id, ct);
        return result.IsSuccess ? Ok(result.Data) : NotFound(new { error = result.Error });
    }

    [HttpPost]
    [HasPermission(PermissionConstants.Companies.Create)]
    public async Task<IActionResult> Create([FromBody] CreateCompanyRequest request, CancellationToken ct)
    {
        var result = await _companyService.CreateAsync(request, ct);
        return result.IsSuccess
            ? StatusCode(201, result.Data)
            : StatusCode(result.StatusCode, new { error = result.Error });
    }

    [HttpPut("{id:long}")]
    [HasPermission(PermissionConstants.Companies.Update)]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateCompanyRequest request, CancellationToken ct)
    {
        var result = await _companyService.UpdateAsync(id, request, ct);
        return result.IsSuccess
            ? Ok(result.Data)
            : StatusCode(result.StatusCode, new { error = result.Error });
    }

    [HttpDelete("{id:long}")]
    [HasPermission(PermissionConstants.Companies.Delete)]
    public async Task<IActionResult> Delete(long id, CancellationToken ct)
    {
        var result = await _companyService.DeleteAsync(id, ct);
        return result.IsSuccess ? NoContent() : StatusCode(result.StatusCode, new { error = result.Error });
    }
}
