using Microsoft.EntityFrameworkCore;
using PozzBackend.Common.Infrastructure;
using PozzBackend.Modules.Investors.Application.DTOs;
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
            .OrderByDescending(i => i.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        return (items, total);
    }

    public async Task<(IEnumerable<Investor> Items, int TotalCount)> SearchAsync(
        InvestorSearchRequest request, CancellationToken ct = default)
    {
        var query = _db.Investors
            .Include(i => i.User)
            .Include(i => i.Company)
            .AsQueryable();

        // ── Filters ────────────────────────────────────────────────────────
        if (request.CompanyId.HasValue)
            query = query.Where(i => i.CompanyId == request.CompanyId);

        if (request.PipelineStage.HasValue)
            query = query.Where(i => i.PipelineStage == request.PipelineStage);

        if (request.InvestorType.HasValue)
            query = query.Where(i => i.InvestorType == request.InvestorType);

        if (request.Priority.HasValue)
            query = query.Where(i => i.Priority == request.Priority);

        if (request.IsActive.HasValue)
            query = query.Where(i => i.IsActive == request.IsActive);

        // Search in name, email, phone, position
        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            var term = request.SearchTerm.ToLower();
            query = query.Where(i =>
                (i.User != null && (i.User.FirstName + " " + i.User.LastName).ToLower().Contains(term)) ||
                (i.User != null && i.User.Email != null && i.User.Email.ToLower().Contains(term)) ||
                (i.PrimaryEmail != null && i.PrimaryEmail.ToLower().Contains(term)) ||
                (i.PrimaryPhone != null && i.PrimaryPhone.Contains(term)) ||
                (i.Position != null && i.Position.ToLower().Contains(term)));
        }

        var total = await query.CountAsync(ct);

        // ── Sorting ────────────────────────────────────────────────────────
        query = request.SortBy?.ToLower() switch
        {
            "name" => request.SortDirection?.ToLower() == "asc"
                ? query.OrderBy(i => i.User!.FirstName).ThenBy(i => i.User!.LastName)
                : query.OrderByDescending(i => i.User!.FirstName).ThenByDescending(i => i.User!.LastName),
            "createdat" => request.SortDirection?.ToLower() == "asc"
                ? query.OrderBy(i => i.CreatedAt)
                : query.OrderByDescending(i => i.CreatedAt),
            "priority" => request.SortDirection?.ToLower() == "asc"
                ? query.OrderBy(i => i.Priority)
                : query.OrderByDescending(i => i.Priority),
            "lastcontactdate" or _ => request.SortDirection?.ToLower() == "asc"
                ? query.OrderBy(i => i.LastContactDate)
                : query.OrderByDescending(i => i.LastContactDate)
        };

        // ── Pagination ─────────────────────────────────────────────────────
        var items = await query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
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
