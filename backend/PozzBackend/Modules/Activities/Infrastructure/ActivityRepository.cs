using Microsoft.EntityFrameworkCore;
using PozzBackend.Common.Infrastructure;
using PozzBackend.Modules.Activities.Domain;

namespace PozzBackend.Modules.Activities.Infrastructure;

public class ActivityRepository : IActivityRepository
{
    private readonly ApplicationDbContext _context;

    public ActivityRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Activity?> GetByIdAsync(long id, CancellationToken cancellationToken = default)
    {
        return await _context.Activities
            .FirstOrDefaultAsync(a => a.Id == id, cancellationToken);
    }

    public async Task<IReadOnlyList<Activity>> GetAllAsync(long companyId, CancellationToken cancellationToken = default)
    {
        return await _context.Activities
            .Where(a => a.CompanyId == companyId)
            .OrderByDescending(a => a.ActivityDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<Activity>> GetByInvestorIdAsync(long investorId, CancellationToken cancellationToken = default)
    {
        return await _context.Activities
            .Where(a => a.InvestorId == investorId)
            .OrderByDescending(a => a.ActivityDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<Activity>> GetByInvestmentIdAsync(long investmentId, CancellationToken cancellationToken = default)
    {
        return await _context.Activities
            .Where(a => a.InvestmentId == investmentId)
            .OrderByDescending(a => a.ActivityDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<Activity>> GetByProjectIdAsync(long projectId, CancellationToken cancellationToken = default)
    {
        return await _context.Activities
            .Where(a => a.ProjectId == projectId)
            .OrderByDescending(a => a.ActivityDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<(IReadOnlyList<Activity> Items, int TotalCount)> SearchAsync(
        long companyId,
        ActivityType? type = null,
        long? investorId = null,
        long? investmentId = null,
        long? projectId = null,
        DateOnly? fromDate = null,
        DateOnly? toDate = null,
        int page = 1,
        int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        var query = _context.Activities
            .Where(a => a.CompanyId == companyId);

        if (type.HasValue)
            query = query.Where(a => a.Type == type.Value);

        if (investorId.HasValue)
            query = query.Where(a => a.InvestorId == investorId.Value);

        if (investmentId.HasValue)
            query = query.Where(a => a.InvestmentId == investmentId.Value);

        if (projectId.HasValue)
            query = query.Where(a => a.ProjectId == projectId.Value);

        if (fromDate.HasValue)
            query = query.Where(a => DateOnly.FromDateTime(a.ActivityDate.DateTime) >= fromDate.Value);

        if (toDate.HasValue)
            query = query.Where(a => DateOnly.FromDateTime(a.ActivityDate.DateTime) <= toDate.Value);

        var totalCount = await query.CountAsync(cancellationToken);

        var items = await query
            .OrderByDescending(a => a.ActivityDate)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (items, totalCount);
    }

    public async Task AddAsync(Activity activity, CancellationToken cancellationToken = default)
    {
        await _context.Activities.AddAsync(activity, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(Activity activity, CancellationToken cancellationToken = default)
    {
        activity.UpdatedAt = DateTimeOffset.UtcNow;
        _context.Activities.Update(activity);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(long id, CancellationToken cancellationToken = default)
    {
        var activity = await GetByIdAsync(id, cancellationToken);
        if (activity != null)
        {
            _context.Activities.Remove(activity);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
