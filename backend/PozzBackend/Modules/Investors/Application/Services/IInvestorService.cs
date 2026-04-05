using PozzBackend.Common.Application;
using PozzBackend.Modules.Investors.Application.DTOs;

namespace PozzBackend.Modules.Investors.Application.Services;

public interface IInvestorService
{
    Task<Result<PagedResult<InvestorDto>>> GetAllAsync(
        int page, int pageSize, long? companyId = null, CancellationToken ct = default);
    Task<Result<InvestorDto>> GetByIdAsync(long id, CancellationToken ct = default);
    Task<Result<InvestorDto>> GetByUserIdAsync(long userId, CancellationToken ct = default);
    Task<Result<InvestorDto>> CreateAsync(CreateInvestorRequest request, CancellationToken ct = default);
    Task<Result<InvestorDto>> UpdateAsync(long id, UpdateInvestorRequest request, CancellationToken ct = default);
    Task<Result<bool>> DeleteAsync(long id, CancellationToken ct = default);
}
