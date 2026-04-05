using PozzBackend.Modules.Onboarding.Domain;

namespace PozzBackend.Modules.Onboarding.Domain;

public interface IOnboardingRepository
{
    Task<UserOnboarding?> GetByUserIdAsync(long userId, CancellationToken ct = default);
    Task<UserOnboarding>  AddAsync(UserOnboarding onboarding, CancellationToken ct = default);
    Task UpdateAsync(UserOnboarding onboarding, CancellationToken ct = default);

    Task<InvestorProfile?> GetInvestorProfileAsync(long userId, CancellationToken ct = default);
    Task<InvestorProfile>  AddInvestorProfileAsync(InvestorProfile profile, CancellationToken ct = default);
    Task UpdateInvestorProfileAsync(InvestorProfile profile, CancellationToken ct = default);
}
