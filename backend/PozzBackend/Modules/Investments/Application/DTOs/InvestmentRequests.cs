using PozzBackend.Modules.Investments.Domain;
using System.ComponentModel.DataAnnotations;

namespace PozzBackend.Modules.Investments.Application.DTOs;

/// <summary>
/// Request DTO for creating a new investment.
/// </summary>
public record CreateInvestmentRequest
{
    // ── Required Core Info ────────────────────────────────────────────────────
    [Required]
    public required long InvestorId { get; init; }
    
    public long? ProjectId { get; init; }
    
    [Required]
    public required long CompanyId { get; init; }
    
    // ── Investment Details ────────────────────────────────────────────────────
    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "Committed amount must be greater than 0")]
    public required decimal CommittedAmount { get; init; }
    
    [Range(0, double.MaxValue, ErrorMessage = "Paid amount cannot be negative")]
    public decimal PaidAmount { get; init; } = 0;
    
    [Required]
    [Range(0, 100, ErrorMessage = "Equity percentage must be between 0 and 100")]
    public required decimal EquityPercentage { get; init; }
    
    public InvestmentInstrument Instrument { get; init; } = InvestmentInstrument.Equity;
    public PaymentStatus PaymentStatus { get; init; } = PaymentStatus.Pending;
    
    // ── SAFE / Convertible Note Specific ──────────────────────────────────────
    [Range(0, double.MaxValue, ErrorMessage = "Valuation cap cannot be negative")]
    public decimal? ValuationCap { get; init; }
    
    [Range(0, 100, ErrorMessage = "Discount rate must be between 0 and 100")]
    public decimal? DiscountRate { get; init; }
    
    [Range(0, 100, ErrorMessage = "Interest rate must be between 0 and 100")]
    public decimal? InterestRate { get; init; }
    
    public DateOnly? MaturityDate { get; init; }
    
    // ── Dates ─────────────────────────────────────────────────────────────────
    [Required]
    public required DateOnly CommitmentDate { get; init; }
    
    public DateOnly? ClosingDate { get; init; }
    public DateOnly? FirstPaymentDate { get; init; }
    public DateOnly? FinalPaymentDate { get; init; }
    
    // ── Legal & Documentation ─────────────────────────────────────────────────
    [Url]
    public string? TermSheetUrl { get; init; }
    
    [Url]
    public string? AgreementUrl { get; init; }
    
    [Url]
    public string? ShareCertificateUrl { get; init; }
    
    public long? ShareCertificateNumber { get; init; }
    
    // ── Additional Terms ──────────────────────────────────────────────────────
    public bool HasBoardSeat { get; init; } = false;
    public bool HasVetoRights { get; init; } = false;
    public bool HasInformationRights { get; init; } = true;
    
    [Range(0, 10, ErrorMessage = "Liquidation preference multiple must be between 0 and 10")]
    public int? LiquidationPreferenceMultiple { get; init; }
    
    public bool IsParticipating { get; init; } = false;
    public bool HasAntiDilution { get; init; } = false;
    
    [MaxLength(50)]
    public string? AntiDilutionType { get; init; }
    
    // ── CRM / Tracking ────────────────────────────────────────────────────────
    [MaxLength(2000)]
    public string? Notes { get; init; }
    
    [MaxLength(100)]
    public string? InternalReference { get; init; }
    
    public InvestmentStatus Status { get; init; } = InvestmentStatus.Active;
}

/// <summary>
/// Request DTO for updating an existing investment.
/// </summary>
public record UpdateInvestmentRequest
{
    // ── Investment Details ────────────────────────────────────────────────────
    [Range(0.01, double.MaxValue, ErrorMessage = "Committed amount must be greater than 0")]
    public decimal? CommittedAmount { get; init; }
    
    [Range(0, double.MaxValue, ErrorMessage = "Paid amount cannot be negative")]
    public decimal? PaidAmount { get; init; }
    
    [Range(0, 100, ErrorMessage = "Equity percentage must be between 0 and 100")]
    public decimal? EquityPercentage { get; init; }
    
    public InvestmentInstrument? Instrument { get; init; }
    public PaymentStatus? PaymentStatus { get; init; }
    
    // ── SAFE / Convertible Note Specific ──────────────────────────────────────
    public decimal? ValuationCap { get; init; }
    public decimal? DiscountRate { get; init; }
    public decimal? InterestRate { get; init; }
    public DateOnly? MaturityDate { get; init; }
    
    // ── Dates ─────────────────────────────────────────────────────────────────
    public DateOnly? CommitmentDate { get; init; }
    public DateOnly? ClosingDate { get; init; }
    public DateOnly? FirstPaymentDate { get; init; }
    public DateOnly? FinalPaymentDate { get; init; }
    
    // ── Legal & Documentation ─────────────────────────────────────────────────
    [Url]
    public string? TermSheetUrl { get; init; }
    
    [Url]
    public string? AgreementUrl { get; init; }
    
    [Url]
    public string? ShareCertificateUrl { get; init; }
    
    public long? ShareCertificateNumber { get; init; }
    
    // ── Additional Terms ──────────────────────────────────────────────────────
    public bool? HasBoardSeat { get; init; }
    public bool? HasVetoRights { get; init; }
    public bool? HasInformationRights { get; init; }
    public int? LiquidationPreferenceMultiple { get; init; }
    public bool? IsParticipating { get; init; }
    public bool? HasAntiDilution { get; init; }
    public string? AntiDilutionType { get; init; }
    
    // ── CRM / Tracking ────────────────────────────────────────────────────────
    public string? Notes { get; init; }
    public string? InternalReference { get; init; }
    public InvestmentStatus? Status { get; init; }
}

/// <summary>
/// Request DTO for searching/filtering investments.
/// </summary>
public record InvestmentSearchRequest
{
    public long? CompanyId { get; init; }
    public long? InvestorId { get; init; }
    public long? ProjectId { get; init; }
    public PaymentStatus? PaymentStatus { get; init; }
    public InvestmentStatus? Status { get; init; }
    public InvestmentInstrument? Instrument { get; init; }
    
    [MaxLength(100)]
    public string? SearchTerm { get; init; } // Search in investor name, project name, internal reference
    
    // ── Sorting ───────────────────────────────────────────────────────────────
    public string SortBy { get; init; } = "CommitmentDate"; // Options: CommitmentDate, InvestorName, CommittedAmount, PaidAmount
    public string SortDirection { get; init; } = "desc"; // asc or desc
    
    // ── Pagination ────────────────────────────────────────────────────────────
    [Range(1, int.MaxValue)]
    public int Page { get; init; } = 1;
    
    [Range(1, 100)]
    public int PageSize { get; init; } = 20;
}
