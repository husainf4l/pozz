using Microsoft.EntityFrameworkCore;
using PozzBackend.Common.Infrastructure;
using PozzBackend.Modules.Investors.Domain;

namespace PozzBackend.Modules.Investors.Infrastructure;

public class InvestorRepository : IInvestorRepository
{
    private readonly ApplicationDbContext _db;
    public InvestorRepository(ApplicationDbContext db) => _db = db;

    public Task<Investor?> GetByIdAsync(long id, CancellationToken ct = default)
        => _db.Investors
            .Include(i => i.User)
            .Include(i => i.Company)
            .FirstOrDefaultAsync(i => i.Id == id, ct);

    public Task<Investor?> GetByUserIdAsync(long userId, CancellationToken ct = default)
        => _db.Investors
            .Include(i => i.User)
            .Include(i => i.Company)
            .FirstOrDefaultAsync(i => i.UserId == userId, ct);

    public async Task<(IEnumerable<Investor> Items, int TotalCount)> GetAllAsync(
        int page, int pageSize, long? companyId = null, CancellationToken ct = default)
    {
        var query = _db.Investors
            .Include(i => i.User)
            .Include(i => i.Company)
            .AsQueryable();

        if (companyId.HasValue)
            query = query.Where(i => i.CompanyId == companyId);

        var total = await query.CountAsync(ct);
        var items = await query
            .OrderBy(i => i.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        return (items, total);
    }

    public async Task<Investor> AddAsync(Investor investor, CancellationToken ct = default)
    {
        _db.Investors.Add(investor);
        await _db.SaveChangesAsync(ct);
        return investor;
    }

    public Task UpdateAsync(Investor investor, CancellationToken ct = default)
    {
        _db.Investors.Update(investor);
        return _db.SaveChangesAsync(ct);
    }
}
