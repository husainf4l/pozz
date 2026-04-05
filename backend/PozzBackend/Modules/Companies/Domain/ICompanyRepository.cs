using PozzBackend.Modules.Companies.Domain;

namespace PozzBackend.Modules.Companies.Domain;

public interface ICompanyRepository
{
    Task<Company?> GetByIdAsync(long id, CancellationToken ct = default);
    Task<(IEnumerable<Company> Items, int TotalCount)> GetAllAsync(
        int page, int pageSize, CancellationToken ct = default);
    Task<Company> AddAsync(Company company, CancellationToken ct = default);
    Task UpdateAsync(Company company, CancellationToken ct = default);
}
