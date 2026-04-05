using Microsoft.EntityFrameworkCore;
using PozzBackend.Common.Infrastructure;
using PozzBackend.Modules.Onboarding.Domain;

namespace PozzBackend.Modules.Onboarding.Infrastructure;

public class OnboardingRepository : IOnboardingRepository
{
    private readonly ApplicationDbContext _db;
    public OnboardingRepository(ApplicationDbContext db) => _db = db;

    public Task<UserOnboarding?> GetByUserIdAsync(long userId, CancellationToken ct = default)
        => _db.UserOnboardings
              .Include(o => o.User)
              .FirstOrDefaultAsync(o => o.UserId == userId, ct);

    public async Task<UserOnboarding> AddAsync(UserOnboarding onboarding, CancellationToken ct = default)
    {
        _db.UserOnboardings.Add(onboarding);
        await _db.SaveChangesAsync(ct);
        return onboarding;
    }

    public Task UpdateAsync(UserOnboarding onboarding, CancellationToken ct = default)
    {
        _db.UserOnboardings.Update(onboarding);
        return _db.SaveChangesAsync(ct);
    }

    public Task<InvestorProfile?> GetInvestorProfileAsync(long userId, CancellationToken ct = default)
        => _db.InvestorProfiles.FirstOrDefaultAsync(p => p.UserId == userId, ct);

    public async Task<InvestorProfile> AddInvestorProfileAsync(
        InvestorProfile profile, CancellationToken ct = default)
    {
        _db.InvestorProfiles.Add(profile);
        await _db.SaveChangesAsync(ct);
        return profile;
    }

    public Task UpdateInvestorProfileAsync(InvestorProfile profile, CancellationToken ct = default)
    {
        _db.InvestorProfiles.Update(profile);
        return _db.SaveChangesAsync(ct);
    }
}
