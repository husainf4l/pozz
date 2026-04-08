using PozzBackend.Modules.Investments.Domain;
using System.ComponentModel.DataAnnotations;

namespace PozzBackend.Modules.Investments.Application.DTOs;

/// <summary>
/// Complete investment data transfer object for detailed views.
/// </summary>
public record InvestmentDto
{
    // ── Identity ──────────────────────────────────────────────────────────────
    public long Id { get; init; }
    public long InvestorId { get; init; }
    public string InvestorName { get; init; } = string.Empty;
    public string? InvestorEmail { get; init; }
    public long? ProjectId { get; init; }
    public string? ProjectName { get; init; }
    public long CompanyId { get; init; }
    
    // ── Investment Details ────────────────────────────────────────────────────
    public decimal CommittedAmount { get; init; }
    public decimal PaidAmount { get; init; }
    public decimal RemainingAmount { get; init; }
    public decimal EquityPercentage { get; init; }
    public string Instrument { get; init; } = string.Empty;
    public string PaymentStatus { get; init; } = string.Empty;
    
    // ── SAFE / Convertible Note Specific ──────────────────────────────────────
    public decimal? ValuationCap { get; init; }
    public decimal? DiscountRate { get; init; }
    public decimal? InterestRate { get; init; }
    public DateOnly? MaturityDate { get; init; }
    
    // ── Dates ─────────────────────────────────────────────────────────────────
    public DateOnly CommitmentDate { get; init; }
    public DateOnly? ClosingDate { get; init; }
    public DateOnly? FirstPaymentDate { get; init; }
    public DateOnly? FinalPaymentDate { get; init; }
    
    // ── Legal & Documentation ─────────────────────────────────────────────────
    public string? TermSheetUrl { get; init; }
    public string? AgreementUrl { get; init; }
    public string? ShareCertificateUrl { get; init; }
    public long? ShareCertificateNumber { get; init; }
    
    // ── Additional Terms ──────────────────────────────────────────────────────
    public bool HasBoardSeat { get; init; }
    public bool HasVetoRights { get; init; }
    public bool HasInformationRights { get; init; }
    public int? LiquidationPreferenceMultiple { get; init; }
    public bool IsParticipating { get; init; }
    public bool HasAntiDilution { get; init; }
    public string? AntiDilutionType { get; init; }
    
    // ── CRM / Tracking ────────────────────────────────────────────────────────
    public string? Notes { get; init; }
    public string? InternalReference { get; init; }
    public string Status { get; init; } = string.Empty;
    
    // ── Metadata ──────────────────────────────────────────────────────────────
    public DateTimeOffset CreatedAt { get; init; }
    public DateTimeOffset UpdatedAt { get; init; }
    public long? CreatedBy { get; init; }
    public long? LastModifiedBy { get; init; }
}

/// <summary>
/// Lightweight investment DTO for list views.
/// </summary>
public record InvestmentListDto
{
    public long Id { get; init; }
    public string InvestorName { get; init; } = string.Empty;
    public string? ProjectName { get; init; }
    public decimal CommittedAmount { get; init; }
    public decimal PaidAmount { get; init; }
    public decimal RemainingAmount { get; init; }
    public decimal EquityPercentage { get; init; }
    public string Instrument { get; init; } = string.Empty;
    public string PaymentStatus { get; init; } = string.Empty;
    public DateOnly CommitmentDate { get; init; }
    public DateOnly? ClosingDate { get; init; }
    public string Status { get; init; } = string.Empty;
}
