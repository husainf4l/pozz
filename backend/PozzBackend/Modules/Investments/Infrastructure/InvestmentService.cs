using PozzBackend.Common.Application;
using PozzBackend.Modules.Investments.Application.DTOs;
using PozzBackend.Modules.Investments.Application.Services;
using PozzBackend.Modules.Investments.Domain;

namespace PozzBackend.Modules.Investments.Infrastructure;

/// <summary>
/// Service implementation for investment business logic.
/// </summary>
public class InvestmentService : IInvestmentService
{
    private readonly IInvestmentRepository _repository;
    
    public InvestmentService(IInvestmentRepository repository)
    {
        _repository = repository;
    }
    
    public async Task<Result<PagedResult<InvestmentListDto>>> GetAllAsync(
        int page, 
        int pageSize, 
        long? companyId = null, 
        CancellationToken ct = default)
    {
        var (items, totalCount) = await _repository.GetAllAsync(page, pageSize, companyId, ct);
        
        var dtos = items.Select(MapToListDto).ToList();
        
        var pagedResult = new PagedResult<InvestmentListDto>(dtos, totalCount, page, pageSize);
        
        return Result<PagedResult<InvestmentListDto>>.Success(pagedResult);
    }
    
    public async Task<Result<PagedResult<InvestmentListDto>>> SearchAsync(
        InvestmentSearchRequest request, 
        CancellationToken ct = default)
    {
        var (items, totalCount) = await _repository.SearchAsync(request, ct);
        
        var dtos = items.Select(MapToListDto).ToList();
        
        var pagedResult = new PagedResult<InvestmentListDto>(dtos, totalCount, request.Page, request.PageSize);
        
        return Result<PagedResult<InvestmentListDto>>.Success(pagedResult);
    }
    
    public async Task<Result<InvestmentDto>> GetByIdAsync(long id, CancellationToken ct = default)
    {
        var investment = await _repository.GetByIdAsync(id, ct);
        
        if (investment == null)
            return Result<InvestmentDto>.NotFound("Investment not found");
        
        return Result<InvestmentDto>.Success(MapToDto(investment));
    }
    
    public async Task<Result<PagedResult<InvestmentListDto>>> GetByInvestorIdAsync(
        long investorId, 
        int page = 1, 
        int pageSize = 20, 
        CancellationToken ct = default)
    {
        var (items, totalCount) = await _repository.GetByInvestorIdAsync(investorId, page, pageSize, ct);
        
        var dtos = items.Select(MapToListDto).ToList();
        
        var pagedResult = new PagedResult<InvestmentListDto>(dtos, totalCount, page, pageSize);
        
        return Result<PagedResult<InvestmentListDto>>.Success(pagedResult);
    }
    
    public async Task<Result<PagedResult<InvestmentListDto>>> GetByProjectIdAsync(
        long projectId, 
        int page = 1, 
        int pageSize = 20, 
        CancellationToken ct = default)
    {
        var (items, totalCount) = await _repository.GetByProjectIdAsync(projectId, page, pageSize, ct);
        
        var dtos = items.Select(MapToListDto).ToList();
        
        var pagedResult = new PagedResult<InvestmentListDto>(dtos, totalCount, page, pageSize);
        
        return Result<PagedResult<InvestmentListDto>>.Success(pagedResult);
    }
    
    public async Task<Result<InvestmentDto>> CreateAsync(
        CreateInvestmentRequest request, 
        CancellationToken ct = default)
    {
        var investment = new Investment
        {
            // ── Core Investment Info ──────────────────────────────────────────
            InvestorId = request.InvestorId,
            ProjectId = request.ProjectId,
            CompanyId = request.CompanyId,
            
            // ── Investment Details ────────────────────────────────────────────
            CommittedAmount = request.CommittedAmount,
            PaidAmount = request.PaidAmount,
            EquityPercentage = request.EquityPercentage,
            Instrument = request.Instrument,
            PaymentStatus = request.PaymentStatus,
            
            // ── SAFE / Convertible Note Specific ──────────────────────────────
            ValuationCap = request.ValuationCap,
            DiscountRate = request.DiscountRate,
            InterestRate = request.InterestRate,
            MaturityDate = request.MaturityDate,
            
            // ── Dates ─────────────────────────────────────────────────────────
            CommitmentDate = request.CommitmentDate,
            ClosingDate = request.ClosingDate,
            FirstPaymentDate = request.FirstPaymentDate,
            FinalPaymentDate = request.FinalPaymentDate,
            
            // ── Legal & Documentation ─────────────────────────────────────────
            TermSheetUrl = request.TermSheetUrl,
            AgreementUrl = request.AgreementUrl,
            ShareCertificateUrl = request.ShareCertificateUrl,
            ShareCertificateNumber = request.ShareCertificateNumber,
            
            // ── Additional Terms ──────────────────────────────────────────────
            HasBoardSeat = request.HasBoardSeat,
            HasVetoRights = request.HasVetoRights,
            HasInformationRights = request.HasInformationRights,
            LiquidationPreferenceMultiple = request.LiquidationPreferenceMultiple,
            IsParticipating = request.IsParticipating,
            HasAntiDilution = request.HasAntiDilution,
            AntiDilutionType = request.AntiDilutionType,
            
            // ── CRM / Tracking ────────────────────────────────────────────────
            Notes = request.Notes,
            InternalReference = request.InternalReference,
            Status = request.Status,
            
            // ── Metadata ──────────────────────────────────────────────────────
            CreatedAt = DateTimeOffset.UtcNow,
            UpdatedAt = DateTimeOffset.UtcNow
        };
        
        var created = await _repository.AddAsync(investment, ct);
        
        return Result<InvestmentDto>.Created(MapToDto(created));
    }
    
    public async Task<Result<InvestmentDto>> UpdateAsync(
        long id, 
        UpdateInvestmentRequest request, 
        CancellationToken ct = default)
    {
        var investment = await _repository.GetByIdAsync(id, ct);
        
        if (investment == null)
            return Result<InvestmentDto>.NotFound("Investment not found");
        
        // ── Update only provided fields ───────────────────────────────────────
        if (request.CommittedAmount.HasValue)
            investment.CommittedAmount = request.CommittedAmount.Value;
        
        if (request.PaidAmount.HasValue)
            investment.PaidAmount = request.PaidAmount.Value;
        
        if (request.EquityPercentage.HasValue)
            investment.EquityPercentage = request.EquityPercentage.Value;
        
        if (request.Instrument.HasValue)
            investment.Instrument = request.Instrument.Value;
        
        if (request.PaymentStatus.HasValue)
            investment.PaymentStatus = request.PaymentStatus.Value;
        
        if (request.ValuationCap.HasValue)
            investment.ValuationCap = request.ValuationCap.Value;
        
        if (request.DiscountRate.HasValue)
            investment.DiscountRate = request.DiscountRate.Value;
        
        if (request.InterestRate.HasValue)
            investment.InterestRate = request.InterestRate.Value;
        
        if (request.MaturityDate.HasValue)
            investment.MaturityDate = request.MaturityDate.Value;
        
        if (request.CommitmentDate.HasValue)
            investment.CommitmentDate = request.CommitmentDate.Value;
        
        if (request.ClosingDate.HasValue)
            investment.ClosingDate = request.ClosingDate.Value;
        
        if (request.FirstPaymentDate.HasValue)
            investment.FirstPaymentDate = request.FirstPaymentDate.Value;
        
        if (request.FinalPaymentDate.HasValue)
            investment.FinalPaymentDate = request.FinalPaymentDate.Value;
        
        if (request.TermSheetUrl != null)
            investment.TermSheetUrl = request.TermSheetUrl;
        
        if (request.AgreementUrl != null)
            investment.AgreementUrl = request.AgreementUrl;
        
        if (request.ShareCertificateUrl != null)
            investment.ShareCertificateUrl = request.ShareCertificateUrl;
        
        if (request.ShareCertificateNumber.HasValue)
            investment.ShareCertificateNumber = request.ShareCertificateNumber.Value;
        
        if (request.HasBoardSeat.HasValue)
            investment.HasBoardSeat = request.HasBoardSeat.Value;
        
        if (request.HasVetoRights.HasValue)
            investment.HasVetoRights = request.HasVetoRights.Value;
        
        if (request.HasInformationRights.HasValue)
            investment.HasInformationRights = request.HasInformationRights.Value;
        
        if (request.LiquidationPreferenceMultiple.HasValue)
            investment.LiquidationPreferenceMultiple = request.LiquidationPreferenceMultiple.Value;
        
        if (request.IsParticipating.HasValue)
            investment.IsParticipating = request.IsParticipating.Value;
        
        if (request.HasAntiDilution.HasValue)
            investment.HasAntiDilution = request.HasAntiDilution.Value;
        
        if (request.AntiDilutionType != null)
            investment.AntiDilutionType = request.AntiDilutionType;
        
        if (request.Notes != null)
            investment.Notes = request.Notes;
        
        if (request.InternalReference != null)
            investment.InternalReference = request.InternalReference;
        
        if (request.Status.HasValue)
            investment.Status = request.Status.Value;
        
        investment.UpdatedAt = DateTimeOffset.UtcNow;
        
        await _repository.UpdateAsync(investment, ct);
        
        return Result<InvestmentDto>.Success(MapToDto(investment));
    }
    
    public async Task<Result<bool>> DeleteAsync(long id, CancellationToken ct = default)
    {
        var investment = await _repository.GetByIdAsync(id, ct);
        
        if (investment == null)
            return Result<bool>.NotFound("Investment not found");
        
        // Soft delete by setting status to Cancelled
        investment.Status = InvestmentStatus.Cancelled;
        investment.UpdatedAt = DateTimeOffset.UtcNow;
        
        await _repository.UpdateAsync(investment, ct);
        
        return Result<bool>.Success(true);
    }
    
    public async Task<Result<decimal>> GetTotalRaisedAsync(long companyId, CancellationToken ct = default)
    {
        var total = await _repository.GetTotalRaisedAsync(companyId, ct);
        return Result<decimal>.Success(total);
    }
    
    // ── Private Mapping Methods ──────────────────────────────────────────────
    
    private static InvestmentDto MapToDto(Investment investment)
    {
        var investorName = investment.Investor?.User != null
            ? $"{investment.Investor.User.FirstName} {investment.Investor.User.LastName}".Trim()
            : "Unknown";
        
        return new InvestmentDto
        {
            Id = investment.Id,
            InvestorId = investment.InvestorId,
            InvestorName = investorName,
            InvestorEmail = investment.Investor?.User?.Email,
            ProjectId = investment.ProjectId,
            ProjectName = investment.Project?.Title,
            CompanyId = investment.CompanyId,
            
            CommittedAmount = investment.CommittedAmount,
            PaidAmount = investment.PaidAmount,
            RemainingAmount = investment.RemainingAmount,
            EquityPercentage = investment.EquityPercentage,
            Instrument = investment.Instrument.ToString(),
            PaymentStatus = investment.PaymentStatus.ToString(),
            
            ValuationCap = investment.ValuationCap,
            DiscountRate = investment.DiscountRate,
            InterestRate = investment.InterestRate,
            MaturityDate = investment.MaturityDate,
            
            CommitmentDate = investment.CommitmentDate,
            ClosingDate = investment.ClosingDate,
            FirstPaymentDate = investment.FirstPaymentDate,
            FinalPaymentDate = investment.FinalPaymentDate,
            
            TermSheetUrl = investment.TermSheetUrl,
            AgreementUrl = investment.AgreementUrl,
            ShareCertificateUrl = investment.ShareCertificateUrl,
            ShareCertificateNumber = investment.ShareCertificateNumber,
            
            HasBoardSeat = investment.HasBoardSeat,
            HasVetoRights = investment.HasVetoRights,
            HasInformationRights = investment.HasInformationRights,
            LiquidationPreferenceMultiple = investment.LiquidationPreferenceMultiple,
            IsParticipating = investment.IsParticipating,
            HasAntiDilution = investment.HasAntiDilution,
            AntiDilutionType = investment.AntiDilutionType,
            
            Notes = investment.Notes,
            InternalReference = investment.InternalReference,
            Status = investment.Status.ToString(),
            
            CreatedAt = investment.CreatedAt,
            UpdatedAt = investment.UpdatedAt,
            CreatedBy = investment.CreatedBy,
            LastModifiedBy = investment.LastModifiedBy
        };
    }
    
    private static InvestmentListDto MapToListDto(Investment investment)
    {
        var investorName = investment.Investor?.User != null
            ? $"{investment.Investor.User.FirstName} {investment.Investor.User.LastName}".Trim()
            : "Unknown";
        
        return new InvestmentListDto
        {
            Id = investment.Id,
            InvestorName = investorName,
            ProjectName = investment.Project?.Title,
            CommittedAmount = investment.CommittedAmount,
            PaidAmount = investment.PaidAmount,
            RemainingAmount = investment.RemainingAmount,
            EquityPercentage = investment.EquityPercentage,
            Instrument = investment.Instrument.ToString(),
            PaymentStatus = investment.PaymentStatus.ToString(),
            CommitmentDate = investment.CommitmentDate,
            ClosingDate = investment.ClosingDate,
            Status = investment.Status.ToString()
        };
    }
}
