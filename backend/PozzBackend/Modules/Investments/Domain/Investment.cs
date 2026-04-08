using PozzBackend.Common.Domain;
using PozzBackend.Modules.Investors.Domain;
using PozzBackend.Modules.Projects.Domain;

namespace PozzBackend.Modules.Investments.Domain;

public class Investment : AggregateRoot<long>
{
    // ── Core Investment Info ──────────────────────────────────────────────────
    public long InvestorId { get; set; }
    public long? ProjectId { get; set; }
    public long CompanyId { get; set; }
    
    // ── Investment Details ────────────────────────────────────────────────────
    public decimal CommittedAmount { get; set; }
    public decimal PaidAmount { get; set; } = 0;
    public decimal RemainingAmount => CommittedAmount - PaidAmount;
    public decimal EquityPercentage { get; set; }
    public InvestmentInstrument Instrument { get; set; } = InvestmentInstrument.Equity;
    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;
    
    // ── SAFE / Convertible Note Specific ──────────────────────────────────────
    public decimal? ValuationCap { get; set; }
    public decimal? DiscountRate { get; set; }
    public decimal? InterestRate { get; set; }
    public DateOnly? MaturityDate { get; set; }
    
    // ── Dates ─────────────────────────────────────────────────────────────────
    public DateOnly CommitmentDate { get; set; }
    public DateOnly? ClosingDate { get; set; }
    public DateOnly? FirstPaymentDate { get; set; }
    public DateOnly? FinalPaymentDate { get; set; }
    
    // ── Legal & Documentation ─────────────────────────────────────────────────
    public string? TermSheetUrl { get; set; }
    public string? AgreementUrl { get; set; }
    public string? ShareCertificateUrl { get; set; }
    public long? ShareCertificateNumber { get; set; }
    
    // ── Additional Terms ──────────────────────────────────────────────────────
    public bool HasBoardSeat { get; set; } = false;
    public bool HasVetoRights { get; set; } = false;
    public bool HasInformationRights { get; set; } = true;
    public int? LiquidationPreferenceMultiple { get; set; } // 1x, 2x, etc.
    public bool IsParticipating { get; set; } = false; // For liquidation preference
    public bool HasAntiDilution { get; set; } = false;
    public string? AntiDilutionType { get; set; } // "Weighted Average", "Full Ratchet"
    
    // ── CRM / Tracking ────────────────────────────────────────────────────────
    public string? Notes { get; set; }
    public string? InternalReference { get; set; } // Internal tracking number
    public InvestmentStatus Status { get; set; } = InvestmentStatus.Active;
    
    // ── Metadata ──────────────────────────────────────────────────────────────
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
    public long? CreatedBy { get; set; }
    public long? LastModifiedBy { get; set; }
    
    // ── Navigation Properties ─────────────────────────────────────────────────
    public Investor Investor { get; set; } = null!;
    public Project? Project { get; set; }
}
