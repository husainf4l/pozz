namespace PozzBackend.Modules.Onboarding.Domain;

/// <summary>
/// All possible onboarding step keys. Each role has a specific ordered set.
/// </summary>
public static class OnboardingSteps
{
    // ── Shared ──────────────────────────────────────────────────────────────
    public const string PersonalInfo  = "personal_info";
    public const string TermsAccepted = "terms_accepted";

    // ── Investor only ────────────────────────────────────────────────────────
    public const string InvestorProfile = "investor_profile";

    // ── ProjectOwner only ────────────────────────────────────────────────────
    public const string CompanySetup   = "company_setup";
    public const string CompanyDetails = "company_details";

    /// <summary>Returns the ordered required steps for a given role.</summary>
    public static IReadOnlyList<string> GetRequiredFor(OnboardingRole role) => role switch
    {
        OnboardingRole.Investor     => [PersonalInfo, InvestorProfile, TermsAccepted],
        OnboardingRole.ProjectOwner => [PersonalInfo, CompanySetup, CompanyDetails, TermsAccepted],
        _ => throw new ArgumentOutOfRangeException(nameof(role))
    };

    public static string GetLabel(string step) => step switch
    {
        PersonalInfo    => "Personal Information",
        InvestorProfile => "Investor Profile",
        CompanySetup    => "Company Setup",
        CompanyDetails  => "Company Details",
        TermsAccepted   => "Terms & Conditions",
        _               => step
    };
}
