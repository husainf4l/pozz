using PozzBackend.Modules.Onboarding.Application.Services;
using PozzBackend.Modules.Onboarding.Domain;
using PozzBackend.Modules.Onboarding.Infrastructure;

namespace PozzBackend.Modules.Onboarding;

public static class OnboardingModule
{
    public static IServiceCollection AddOnboardingModule(this IServiceCollection services)
    {
        services.AddScoped<IOnboardingRepository, OnboardingRepository>();
        services.AddScoped<IOnboardingService, OnboardingService>();
        return services;
    }
}
