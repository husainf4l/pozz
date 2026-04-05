using PozzBackend.Common.Application;
using PozzBackend.Modules.Companies.Application.DTOs;

namespace PozzBackend.Modules.Companies.Application.Services;

public interface ICompanyService
{
    Task<Result<PagedResult<CompanyDto>>> GetAllAsync(int page, int pageSize, CancellationToken ct = default);
    Task<Result<CompanyDto>> GetByIdAsync(long id, CancellationToken ct = default);
    Task<Result<CompanyDto>> CreateAsync(CreateCompanyRequest request, CancellationToken ct = default);
    Task<Result<CompanyDto>> UpdateAsync(long id, UpdateCompanyRequest request, CancellationToken ct = default);
    Task<Result<bool>> DeleteAsync(long id, CancellationToken ct = default);
}
