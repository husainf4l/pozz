using System.ComponentModel.DataAnnotations;

namespace PozzBackend.Modules.Onboarding.Application.DTOs;

/// <summary>
/// Submitted for the "investor_profile" step (Investor role only).
/// <para>InvestorType: "Individual" | "Institutional"</para>
/// <para>InvestmentBudgetRange: "under_50k" | "50k_250k" | "250k_1m" | "over_1m"</para>
/// <para>InvestmentInterests: free-form sector tags, e.g. ["tech","real_estate","healthcare"]</para>
/// </summary>
public record InvestorProfileRequest(
    [Required] string   InvestorType,
    string?             InvestmentBudgetRange,
    string[]?           InvestmentInterests,
    string?             LinkedInProfile);
