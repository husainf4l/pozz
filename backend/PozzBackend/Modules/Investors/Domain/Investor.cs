using PozzBackend.Common.Domain;
using PozzBackend.Modules.Auth.Domain;
using PozzBackend.Modules.Companies.Domain;

namespace PozzBackend.Modules.Investors.Domain;

public class Investor : AggregateRoot<long>
{
    // ── Basic Info ────────────────────────────────────────────────────────────
    public long UserId { get; set; }
    public long? CompanyId { get; set; }
    public InvestorType InvestorType { get; set; } = InvestorType.Individual;
    public bool IsActive { get; set; } = true;
    
    // ── Contact Information ───────────────────────────────────────────────────
    public string? PrimaryEmail { get; set; }
    public string? SecondaryEmail { get; set; }
    public string? PrimaryPhone { get; set; }
    public string? SecondaryPhone { get; set; }
    public string? AddressLine1 { get; set; }
    public string? AddressLine2 { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? PostalCode { get; set; }
    public string? Country { get; set; }
    
    // ── Professional Details ──────────────────────────────────────────────────
    public string? Position { get; set; }
    public string? LinkedInUrl { get; set; }
    public string? TwitterHandle { get; set; }
    public string? Website { get; set; }
    public int? YearsOfExperience { get; set; }
    
    // ── Investment Profile ────────────────────────────────────────────────────
    public string? InvestmentRange { get; set; } // e.g. "$50K-$100K"
    public string[]? InvestmentFocus { get; set; } // e.g. ["Technology", "Healthcare"]
    public string? PortfolioCompanies { get; set; } // Comma-separated or JSON
    public string? NotableInvestments { get; set; }
    public string? PreviousExits { get; set; }
    
    // ── Pipeline Tracking ─────────────────────────────────────────────────────
    public PipelineStage PipelineStage { get; set; } = PipelineStage.Target;
    public DateTimeOffset? LastContactDate { get; set; }
    public DateTimeOffset? NextFollowUpDate { get; set; }
    public string? Source { get; set; } // How they were found (Referral, LinkedIn, Event, etc.)
    public int Priority { get; set; } = 3; // 1 = High, 2 = Medium, 3 = Low
    
    // ── CRM Data ──────────────────────────────────────────────────────────────
    public string? Notes { get; set; }
    public string? Tags { get; set; } // Comma-separated tags for filtering
    public decimal? PotentialInvestmentAmount { get; set; }
    public string? PreferredInvestmentInstrument { get; set; } // SAFE, Equity, Convertible Note
    
    // ── Metadata ──────────────────────────────────────────────────────────────
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
    public long? CreatedBy { get; set; } // ProjectOwner who added this investor
    public long? LastModifiedBy { get; set; }
    
    // ── Navigation Properties ─────────────────────────────────────────────────
    public ApplicationUser User { get; set; } = null!;
    public Company? Company { get; set; }
}
