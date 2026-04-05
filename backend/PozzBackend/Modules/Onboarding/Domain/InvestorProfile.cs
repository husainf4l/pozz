using PozzBackend.Common.Domain;
using PozzBackend.Modules.Auth.Domain;

namespace PozzBackend.Modules.Onboarding.Domain;

/// <summary>
/// Stores investment-specific details collected during the Investor onboarding flow.
/// </summary>
public class InvestorProfile : Entity<long>
{
    public long   UserId              { get; set; }
    public string InvestorType        { get; set; } = "Individual"; // "Individual" | "Institutional"
    public string? InvestmentBudgetRange { get; set; } // e.g. "under_50k", "50k_250k", "250k_1m", "over_1m"
    public string[] InvestmentInterests  { get; set; } = [];        // e.g. ["tech", "real_estate"]
    public string? LinkedInProfile    { get; set; }
    public bool   TermsAccepted       { get; set; }
    public DateTimeOffset? TermsAcceptedAt { get; set; }
    public DateTimeOffset  CreatedAt  { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset  UpdatedAt  { get; set; } = DateTimeOffset.UtcNow;

    public ApplicationUser User { get; set; } = null!;
}
