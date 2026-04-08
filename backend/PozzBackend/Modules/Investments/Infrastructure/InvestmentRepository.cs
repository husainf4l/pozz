using Microsoft.EntityFrameworkCore;
using PozzBackend.Common.Infrastructure;
using PozzBackend.Modules.Investments.Application.DTOs;
using PozzBackend.Modules.Investments.Domain;

namespace PozzBackend.Modules.Investments.Infrastructure;

/// <summary>
/// Repository implementation for investment data access.
/// </summary>
public class InvestmentRepository : IInvestmentRepository
{
    private readonly ApplicationDbContext _context;
    
    public InvestmentRepository(ApplicationDbContext context)
    {
        _context = context;
    }
    
    public async Task<Investment?> GetByIdAsync(long id, CancellationToken ct = default)
    {
        return await _context.Investments
            .Include(i => i.Investor)
                .ThenInclude(inv => inv.User)
            .Include(i => i.Project)
            .FirstOrDefaultAsync(i => i.Id == id, ct);
    }
    
    public async Task<(IEnumerable<Investment> Items, int TotalCount)> GetAllAsync(
        int page, 
        int pageSize, 
        long? companyId = null, 
        CancellationToken ct = default)
    {
        var query = _context.Investments
            .Include(i => i.Investor)
                .ThenInclude(inv => inv.User)
            .Include(i => i.Project)
            .AsQueryable();
        
        if (companyId.HasValue)
            query = query.Where(i => i.CompanyId == companyId.Value);
        
        var totalCount = await query.CountAsync(ct);
        
        var items = await query
            .OrderByDescending(i => i.CommitmentDate)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);
        
        return (items, totalCount);
    }
    
    public async Task<(IEnumerable<Investment> Items, int TotalCount)> SearchAsync(
        InvestmentSearchRequest request, 
        CancellationToken ct = default)
    {
        var query = _context.Investments
            .Include(i => i.Investor)
                .ThenInclude(inv => inv.User)
            .Include(i => i.Project)
            .AsQueryable();
        
        // ── Apply Filters ─────────────────────────────────────────────────────
        if (request.CompanyId.HasValue)
            query = query.Where(i => i.CompanyId == request.CompanyId.Value);
        
        if (request.InvestorId.HasValue)
            query = query.Where(i => i.InvestorId == request.InvestorId.Value);
        
        if (request.ProjectId.HasValue)
            query = query.Where(i => i.ProjectId == request.ProjectId.Value);
        
        if (request.PaymentStatus.HasValue)
            query = query.Where(i => i.PaymentStatus == request.PaymentStatus.Value);
        
        if (request.Status.HasValue)
            query = query.Where(i => i.Status == request.Status.Value);
        
        if (request.Instrument.HasValue)
            query = query.Where(i => i.Instrument == request.Instrument.Value);
        
        // ── Apply Search Term ─────────────────────────────────────────────────
        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            var searchLower = request.SearchTerm.ToLower();
            query = query.Where(i =>
                (i.Investor.User != null && (i.Investor.User.FirstName + " " + i.Investor.User.LastName).ToLower().Contains(searchLower)) ||
                (i.Project != null && i.Project.Title.ToLower().Contains(searchLower)) ||
                (i.InternalReference != null && i.InternalReference.ToLower().Contains(searchLower))
            );
        }
        
        // ── Apply Sorting ─────────────────────────────────────────────────────
        query = request.SortBy.ToLower() switch
        {
            "investorname" => request.SortDirection.ToLower() == "asc"
                ? query.OrderBy(i => i.Investor.User != null ? i.Investor.User.FirstName + " " + i.Investor.User.LastName : "")
                : query.OrderByDescending(i => i.Investor.User != null ? i.Investor.User.FirstName + " " + i.Investor.User.LastName : ""),
            
            "committedamount" => request.SortDirection.ToLower() == "asc"
                ? query.OrderBy(i => i.CommittedAmount)
                : query.OrderByDescending(i => i.CommittedAmount),
            
            "paidamount" => request.SortDirection.ToLower() == "asc"
                ? query.OrderBy(i => i.PaidAmount)
                : query.OrderByDescending(i => i.PaidAmount),
            
            "commitmentdate" or _ => request.SortDirection.ToLower() == "asc"
                ? query.OrderBy(i => i.CommitmentDate)
                : query.OrderByDescending(i => i.CommitmentDate)
        };
        
        var totalCount = await query.CountAsync(ct);
        
        // ── Apply Pagination ──────────────────────────────────────────────────
        var items = await query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(ct);
        
        return (items, totalCount);
    }
    
    public async Task<(IEnumerable<Investment> Items, int TotalCount)> GetByInvestorIdAsync(
        long investorId, 
        int page, 
        int pageSize, 
        CancellationToken ct = default)
    {
        var query = _context.Investments
            .Include(i => i.Investor)
                .ThenInclude(inv => inv.User)
            .Include(i => i.Project)
            .Where(i => i.InvestorId == investorId);
        
        var totalCount = await query.CountAsync(ct);
        
        var items = await query
            .OrderByDescending(i => i.CommitmentDate)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);
        
        return (items, totalCount);
    }
    
    public async Task<(IEnumerable<Investment> Items, int TotalCount)> GetByProjectIdAsync(
        long projectId, 
        int page, 
        int pageSize, 
        CancellationToken ct = default)
    {
        var query = _context.Investments
            .Include(i => i.Investor)
                .ThenInclude(inv => inv.User)
            .Include(i => i.Project)
            .Where(i => i.ProjectId == projectId);
        
        var totalCount = await query.CountAsync(ct);
        
        var items = await query
            .OrderByDescending(i => i.CommitmentDate)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);
        
        return (items, totalCount);
    }
    
    public async Task<Investment> AddAsync(Investment investment, CancellationToken ct = default)
    {
        _context.Investments.Add(investment);
        await _context.SaveChangesAsync(ct);
        
        // Reload with navigation properties
        return (await GetByIdAsync(investment.Id, ct))!;
    }
    
    public async Task UpdateAsync(Investment investment, CancellationToken ct = default)
    {
        _context.Investments.Update(investment);
        await _context.SaveChangesAsync(ct);
    }
    
    public async Task<decimal> GetTotalRaisedAsync(long companyId, CancellationToken ct = default)
    {
        return await _context.Investments
            .Where(i => i.CompanyId == companyId && i.Status == InvestmentStatus.Active)
            .SumAsync(i => i.PaidAmount, ct);
    }
}
