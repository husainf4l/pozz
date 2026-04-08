using PozzBackend.Modules.Investments.Application.Services;
using PozzBackend.Modules.Investments.Domain;
using PozzBackend.Modules.Investments.Infrastructure;

namespace PozzBackend.Modules.Investments;

public static class InvestmentsModule
{
    public static IServiceCollection AddInvestmentsModule(this IServiceCollection services)
    {
        services.AddScoped<IInvestmentRepository, InvestmentRepository>();
        services.AddScoped<IInvestmentService, InvestmentService>();
        return services;
    }
}
