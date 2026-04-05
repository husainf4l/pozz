using PozzBackend.Modules.Investors.Application.Services;
using PozzBackend.Modules.Investors.Domain;
using PozzBackend.Modules.Investors.Infrastructure;

namespace PozzBackend.Modules.Investors;

public static class InvestorsModule
{
    public static IServiceCollection AddInvestorsModule(this IServiceCollection services)
    {
        services.AddScoped<IInvestorRepository, InvestorRepository>();
        services.AddScoped<IInvestorService, InvestorService>();
        return services;
    }
}
