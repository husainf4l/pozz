using PozzBackend.Common.Application;
using PozzBackend.Modules.Investments.Application.DTOs;

namespace PozzBackend.Modules.Investments.Application.Services;

/// <summary>
/// Service interface for investment operations.
/// </summary>
public interface IInvestmentService
{
    /// <summary>
    /// Get all investments with simple pagination.
    /// </summary>
    Task<Result<PagedResult<InvestmentListDto>>> GetAllAsync(
        int page, 
        int pageSize, 
        long? companyId = null, 
        CancellationToken ct = default);
    
    /// <summary>
    /// Search investments with advanced filtering and sorting.
    /// </summary>
    Task<Result<PagedResult<InvestmentListDto>>> SearchAsync(
        InvestmentSearchRequest request, 
        CancellationToken ct = default);
    
    /// <summary>
    /// Get a single investment by ID with full details.
    /// </summary>
    Task<Result<InvestmentDto>> GetByIdAsync(long id, CancellationToken ct = default);
    
    /// <summary>
    /// Get all investments for a specific investor.
    /// </summary>
    Task<Result<PagedResult<InvestmentListDto>>> GetByInvestorIdAsync(
        long investorId, 
        int page = 1, 
        int pageSize = 20, 
        CancellationToken ct = default);
    
    /// <summary>
    /// Get all investments for a specific project.
    /// </summary>
    Task<Result<PagedResult<InvestmentListDto>>> GetByProjectIdAsync(
        long projectId, 
        int page = 1, 
        int pageSize = 20, 
        CancellationToken ct = default);
    
    /// <summary>
    /// Create a new investment.
    /// </summary>
    Task<Result<InvestmentDto>> CreateAsync(
        CreateInvestmentRequest request, 
        CancellationToken ct = default);
    
    /// <summary>
    /// Update an existing investment.
    /// </summary>
    Task<Result<InvestmentDto>> UpdateAsync(
        long id, 
        UpdateInvestmentRequest request, 
        CancellationToken ct = default);
    
    /// <summary>
    /// Delete (soft delete) an investment by setting status to Cancelled.
    /// </summary>
    Task<Result<bool>> DeleteAsync(long id, CancellationToken ct = default);
    
    /// <summary>
    /// Get total raised amount for a company.
    /// </summary>
    Task<Result<decimal>> GetTotalRaisedAsync(long companyId, CancellationToken ct = default);
}
