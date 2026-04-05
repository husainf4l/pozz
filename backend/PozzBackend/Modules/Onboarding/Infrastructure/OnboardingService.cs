using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PozzBackend.Common.Application;
using PozzBackend.Common.Infrastructure;
using PozzBackend.Modules.Auth.Domain;
using PozzBackend.Modules.Companies.Domain;
using PozzBackend.Modules.Onboarding.Application.DTOs;
using PozzBackend.Modules.Onboarding.Application.Services;
using PozzBackend.Modules.Onboarding.Domain;

namespace PozzBackend.Modules.Onboarding.Infrastructure;

public class OnboardingService : IOnboardingService
{
    private readonly IOnboardingRepository _repo;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ApplicationDbContext _db;

    public OnboardingService(
        IOnboardingRepository repo,
        UserManager<ApplicationUser> userManager,
        ApplicationDbContext db)
    {
        _repo = repo;
        _userManager = userManager;
        _db = db;
    }

    // ── Status ─────────────────────────────────────────────────────────────
    public async Task<Result<OnboardingStatusDto>> GetStatusAsync(
        long userId, CancellationToken ct = default)
    {
        var onboarding = await _repo.GetByUserIdAsync(userId, ct);
        if (onboarding is null)
            return Result<OnboardingStatusDto>.NotFound(
                "Onboarding record not found. Ensure the user was registered correctly.");

        return Result<OnboardingStatusDto>.Success(MapToDto(onboarding));
    }

    // ── Step 1: Personal Info ──────────────────────────────────────────────
    public async Task<Result<OnboardingStatusDto>> CompletePersonalInfoAsync(
        long userId, PersonalInfoRequest request, CancellationToken ct = default)
    {
        var onboarding = await RequireOnboardingAsync(userId, ct);
        if (onboarding is null)
            return Result<OnboardingStatusDto>.NotFound("Onboarding record not found.");

        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user is null) return Result<OnboardingStatusDto>.NotFound("User not found.");

        user.FirstName   = request.FirstName;
        user.LastName    = request.LastName;
        user.PhoneNumber = request.PhoneNumber ?? user.PhoneNumber;
        user.DateOfBirth = request.DateOfBirth ?? user.DateOfBirth;
        user.Nationality = request.Nationality ?? user.Nationality;
        user.Country     = request.Country ?? user.Country;
        user.UpdatedAt   = DateTimeOffset.UtcNow;

        await _userManager.UpdateAsync(user);

        onboarding.CompleteStep(OnboardingSteps.PersonalInfo);
        await _repo.UpdateAsync(onboarding, ct);

        return Result<OnboardingStatusDto>.Success(MapToDto(onboarding));
    }

    // ── Step 2a: Investor Profile ──────────────────────────────────────────
    public async Task<Result<OnboardingStatusDto>> CompleteInvestorProfileAsync(
        long userId, InvestorProfileRequest request, CancellationToken ct = default)
    {
        var onboarding = await RequireOnboardingAsync(userId, ct);
        if (onboarding is null)
            return Result<OnboardingStatusDto>.NotFound("Onboarding record not found.");

        if (onboarding.OnboardingRole != OnboardingRole.Investor)
            return Result<OnboardingStatusDto>.Failure(
                "This step is only for the Investor role.", 422);

        if (!onboarding.HasStep(OnboardingSteps.PersonalInfo))
            return Result<OnboardingStatusDto>.Failure(
                "Complete 'Personal Information' step first.", 422);

        var profile = await _repo.GetInvestorProfileAsync(userId, ct);
        if (profile is null)
        {
            profile = new InvestorProfile { UserId = userId };
            profile.InvestorType        = request.InvestorType;
            profile.InvestmentBudgetRange = request.InvestmentBudgetRange;
            profile.InvestmentInterests  = request.InvestmentInterests ?? [];
            profile.LinkedInProfile      = request.LinkedInProfile;
            await _repo.AddInvestorProfileAsync(profile, ct);
        }
        else
        {
            profile.InvestorType          = request.InvestorType;
            profile.InvestmentBudgetRange = request.InvestmentBudgetRange;
            profile.InvestmentInterests   = request.InvestmentInterests ?? profile.InvestmentInterests;
            profile.LinkedInProfile       = request.LinkedInProfile ?? profile.LinkedInProfile;
            profile.UpdatedAt             = DateTimeOffset.UtcNow;
            await _repo.UpdateInvestorProfileAsync(profile, ct);
        }

        // Also ensure an Investor record exists in the investors module
        var hasInvestorRecord = await _db.Investors.AnyAsync(i => i.UserId == userId, ct);
        if (!hasInvestorRecord)
        {
            _db.Investors.Add(new Modules.Investors.Domain.Investor
            {
                UserId       = userId,
                InvestorType = profile.InvestorType == "Institutional"
                    ? Modules.Investors.Domain.InvestorType.Institutional
                    : Modules.Investors.Domain.InvestorType.Individual
            });
            await _db.SaveChangesAsync(ct);
        }

        onboarding.CompleteStep(OnboardingSteps.InvestorProfile);
        await _repo.UpdateAsync(onboarding, ct);

        return Result<OnboardingStatusDto>.Success(MapToDto(onboarding));
    }

    // ── Step 2b: Company Setup (ProjectOwner) ──────────────────────────────
    public async Task<Result<OnboardingStatusDto>> CompleteCompanySetupAsync(
        long userId, CompanySetupRequest request, CancellationToken ct = default)
    {
        var onboarding = await RequireOnboardingAsync(userId, ct);
        if (onboarding is null)
            return Result<OnboardingStatusDto>.NotFound("Onboarding record not found.");

        if (onboarding.OnboardingRole != OnboardingRole.ProjectOwner)
            return Result<OnboardingStatusDto>.Failure(
                "This step is only for the ProjectOwner role.", 422);

        if (!onboarding.HasStep(OnboardingSteps.PersonalInfo))
            return Result<OnboardingStatusDto>.Failure(
                "Complete 'Personal Information' step first.", 422);

        // Check if the owner already has a company
        var existingCompany = await _db.Companies
            .FirstOrDefaultAsync(c => c.OwnerId == userId, ct);

        if (existingCompany is null)
        {
            var company = new Company
            {
                Name               = request.CompanyName,
                RegistrationNumber = request.RegistrationNumber,
                Industry           = request.Industry,
                TaxNumber          = request.TaxNumber,
                Website            = request.Website,
                Email              = request.Email,
                Phone              = request.Phone,
                Description        = request.Description,
                OwnerId            = userId
            };
            _db.Companies.Add(company);
            await _db.SaveChangesAsync(ct);
        }
        else
        {
            existingCompany.Name               = request.CompanyName;
            existingCompany.RegistrationNumber = request.RegistrationNumber ?? existingCompany.RegistrationNumber;
            existingCompany.Industry           = request.Industry ?? existingCompany.Industry;
            existingCompany.TaxNumber          = request.TaxNumber ?? existingCompany.TaxNumber;
            existingCompany.Website            = request.Website ?? existingCompany.Website;
            existingCompany.Email              = request.Email ?? existingCompany.Email;
            existingCompany.Phone              = request.Phone ?? existingCompany.Phone;
            existingCompany.Description        = request.Description ?? existingCompany.Description;
            existingCompany.UpdatedAt          = DateTimeOffset.UtcNow;
            _db.Companies.Update(existingCompany);
            await _db.SaveChangesAsync(ct);
        }

        onboarding.CompleteStep(OnboardingSteps.CompanySetup);
        await _repo.UpdateAsync(onboarding, ct);

        return Result<OnboardingStatusDto>.Success(MapToDto(onboarding));
    }

    // ── Step 3b: Company Details (ProjectOwner) ────────────────────────────
    public async Task<Result<OnboardingStatusDto>> CompleteCompanyDetailsAsync(
        long userId, CompanyDetailsRequest request, CancellationToken ct = default)
    {
        var onboarding = await RequireOnboardingAsync(userId, ct);
        if (onboarding is null)
            return Result<OnboardingStatusDto>.NotFound("Onboarding record not found.");

        if (onboarding.OnboardingRole != OnboardingRole.ProjectOwner)
            return Result<OnboardingStatusDto>.Failure(
                "This step is only for the ProjectOwner role.", 422);

        if (!onboarding.HasStep(OnboardingSteps.CompanySetup))
            return Result<OnboardingStatusDto>.Failure(
                "Complete 'Company Setup' step first.", 422);

        var company = await _db.Companies.FirstOrDefaultAsync(c => c.OwnerId == userId, ct);
        if (company is null)
            return Result<OnboardingStatusDto>.NotFound("Company not found. Complete Company Setup first.");

        company.Description = request.Description ?? company.Description;
        company.Industry    = request.Industry    ?? company.Industry;
        company.Website     = request.Website     ?? company.Website;
        company.Email       = request.Email       ?? company.Email;
        company.Phone       = request.Phone       ?? company.Phone;
        company.TaxNumber   = request.TaxNumber   ?? company.TaxNumber;
        company.UpdatedAt   = DateTimeOffset.UtcNow;
        _db.Companies.Update(company);
        await _db.SaveChangesAsync(ct);

        onboarding.CompleteStep(OnboardingSteps.CompanyDetails);
        await _repo.UpdateAsync(onboarding, ct);

        return Result<OnboardingStatusDto>.Success(MapToDto(onboarding));
    }

    // ── Final Step: Accept Terms ───────────────────────────────────────────
    public async Task<Result<OnboardingStatusDto>> AcceptTermsAsync(
        long userId, CancellationToken ct = default)
    {
        var onboarding = await RequireOnboardingAsync(userId, ct);
        if (onboarding is null)
            return Result<OnboardingStatusDto>.NotFound("Onboarding record not found.");

        var required = OnboardingSteps.GetRequiredFor(onboarding.OnboardingRole);
        var precedingSteps = required.Where(s => s != OnboardingSteps.TermsAccepted).ToList();

        if (precedingSteps.Any(s => !onboarding.HasStep(s)))
            return Result<OnboardingStatusDto>.Failure(
                "Please complete all prior steps before accepting terms.", 422);

        // Update InvestorProfile terms acceptance
        if (onboarding.OnboardingRole == OnboardingRole.Investor)
        {
            var profile = await _repo.GetInvestorProfileAsync(userId, ct);
            if (profile is not null)
            {
                profile.TermsAccepted   = true;
                profile.TermsAcceptedAt = DateTimeOffset.UtcNow;
                profile.UpdatedAt       = DateTimeOffset.UtcNow;
                await _repo.UpdateInvestorProfileAsync(profile, ct);
            }
        }

        onboarding.CompleteStep(OnboardingSteps.TermsAccepted);
        await _repo.UpdateAsync(onboarding, ct);

        return Result<OnboardingStatusDto>.Success(MapToDto(onboarding));
    }

    // ── Private helpers ────────────────────────────────────────────────────
    private Task<UserOnboarding?> RequireOnboardingAsync(long userId, CancellationToken ct)
        => _repo.GetByUserIdAsync(userId, ct);

    private static OnboardingStatusDto MapToDto(UserOnboarding o)
    {
        var required = OnboardingSteps.GetRequiredFor(o.OnboardingRole);
        var current  = o.GetCurrentStep();

        var steps = required.Select(key => new OnboardingStepDto(
            key,
            OnboardingSteps.GetLabel(key),
            o.HasStep(key),
            true,
            key == current)).ToList();

        return new OnboardingStatusDto(
            o.OnboardingRole.ToString(),
            o.Status.ToString(),
            o.Status == OnboardingStatus.Completed,
            current,
            current is null ? null : OnboardingSteps.GetLabel(current),
            steps,
            o.CompletedAt);
    }
}
