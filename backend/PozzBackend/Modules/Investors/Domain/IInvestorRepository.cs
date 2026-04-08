using PozzBackend.Modules.Investors.Application.DTOs;

namespace PozzBackend.Modules.Investors.Domain;

public interface IInvestorRepository
{
    Task<Investor?> GetByIdAsync(long id, CancellationToken ct = default);
    Task<Investor?> GetByUserIdAsync(long userId, CancellationToken ct = default);
    Task<(IEnumerable<Investor> Items, int TotalCount)> GetAllAsync(
        int page, int pageSize, long? companyId = null, CancellationToken ct = default);
    Task<(IEnumerable<Investor> Items, int TotalCount)> SearchAsync(
        InvestorSearchRequest request, CancellationToken ct = default);
    Task<Investor> AddAsync(Investor investor, CancellationToken ct = default);
    Task UpdateAsync(Investor investor, CancellationToken ct = default);
}
