using Microsoft.EntityFrameworkCore;
using PozzBackend.Common.Infrastructure;
using PozzBackend.Modules.Companies.Domain;

namespace PozzBackend.Modules.Companies.Infrastructure;

public class CompanyRepository : ICompanyRepository
{
    private readonly ApplicationDbContext _db;
    public CompanyRepository(ApplicationDbContext db) => _db = db;

    public Task<Company?> GetByIdAsync(long id, CancellationToken ct = default)
        => _db.Companies.FirstOrDefaultAsync(c => c.Id == id, ct);

    public async Task<(IEnumerable<Company> Items, int TotalCount)> GetAllAsync(
        int page, int pageSize, CancellationToken ct = default)
    {
        var query = _db.Companies.AsQueryable();
        var total = await query.CountAsync(ct);
        var items = await query
            .OrderBy(c => c.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);
        return (items, total);
    }

    public async Task<Company> AddAsync(Company company, CancellationToken ct = default)
    {
        _db.Companies.Add(company);
        await _db.SaveChangesAsync(ct);
        return company;
    }

    public Task UpdateAsync(Company company, CancellationToken ct = default)
    {
        _db.Companies.Update(company);
        return _db.SaveChangesAsync(ct);
    }
}
