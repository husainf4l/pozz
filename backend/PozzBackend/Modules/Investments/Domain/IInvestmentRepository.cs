using PozzBackend.Modules.Investments.Application.DTOs;

namespace PozzBackend.Modules.Investments.Domain;

/// <summary>
/// Repository interface for investment data access.
/// </summary>
public interface IInvestmentRepository
{
    /// <summary>
    /// Get an investment by ID with related entities.
    /// </summary>
    Task<Investment?> GetByIdAsync(long id, CancellationToken ct = default);
    
    /// <summary>
    /// Get all investments with simple pagination.
    /// </summary>
    Task<(IEnumerable<Investment> Items, int TotalCount)> GetAllAsync(
        int page, 
        int pageSize, 
        long? companyId = null, 
        CancellationToken ct = default);
    
    /// <summary>
    /// Search investments with advanced filtering.
    /// </summary>
    Task<(IEnumerable<Investment> Items, int TotalCount)> SearchAsync(
        InvestmentSearchRequest request, 
        CancellationToken ct = default);
    
    /// <summary>
    /// Get all investments for a specific investor.
    /// </summary>
    Task<(IEnumerable<Investment> Items, int TotalCount)> GetByInvestorIdAsync(
        long investorId, 
        int page, 
        int pageSize, 
        CancellationToken ct = default);
    
    /// <summary>
    /// Get all investments for a specific project.
    /// </summary>
    Task<(IEnumerable<Investment> Items, int TotalCount)> GetByProjectIdAsync(
        long projectId, 
        int page, 
        int pageSize, 
        CancellationToken ct = default);
    
    /// <summary>
    /// Add a new investment.
    /// </summary>
    Task<Investment> AddAsync(Investment investment, CancellationToken ct = default);
    
    /// <summary>
    /// Update an existing investment.
    /// </summary>
    Task UpdateAsync(Investment investment, CancellationToken ct = default);
    
    /// <summary>
    /// Get total raised amount (paid) for a company.
    /// </summary>
    Task<decimal> GetTotalRaisedAsync(long companyId, CancellationToken ct = default);
}
