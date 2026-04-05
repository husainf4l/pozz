using PozzBackend.Common.Application;
using PozzBackend.Modules.Onboarding.Application.DTOs;

namespace PozzBackend.Modules.Onboarding.Application.Services;

public interface IOnboardingService
{
    /// <summary>Returns the current onboarding status for the user.</summary>
    Task<Result<OnboardingStatusDto>> GetStatusAsync(long userId, CancellationToken ct = default);

    /// <summary>
    /// Completes the "personal_info" step — updates user's basic profile.
    /// </summary>
    Task<Result<OnboardingStatusDto>> CompletePersonalInfoAsync(
        long userId, PersonalInfoRequest request, CancellationToken ct = default);

    /// <summary>
    /// Completes the "investor_profile" step — saves investment preferences.
    /// Investor role only.
    /// </summary>
    Task<Result<OnboardingStatusDto>> CompleteInvestorProfileAsync(
        long userId, InvestorProfileRequest request, CancellationToken ct = default);

    /// <summary>
    /// Completes the "company_setup" step — creates the owner's company.
    /// ProjectOwner role only.
    /// </summary>
    Task<Result<OnboardingStatusDto>> CompleteCompanySetupAsync(
        long userId, CompanySetupRequest request, CancellationToken ct = default);

    /// <summary>
    /// Completes the "company_details" step — enriches the company profile.
    /// ProjectOwner role only.
    /// </summary>
    Task<Result<OnboardingStatusDto>> CompleteCompanyDetailsAsync(
        long userId, CompanyDetailsRequest request, CancellationToken ct = default);

    /// <summary>
    /// Completes the "terms_accepted" step — marks legal acceptance.
    /// </summary>
    Task<Result<OnboardingStatusDto>> AcceptTermsAsync(long userId, CancellationToken ct = default);
}
