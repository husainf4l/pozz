using PozzBackend.Modules.Companies.Application.Services;
using PozzBackend.Modules.Companies.Domain;
using PozzBackend.Modules.Companies.Infrastructure;

namespace PozzBackend.Modules.Companies;

public static class CompaniesModule
{
    public static IServiceCollection AddCompaniesModule(this IServiceCollection services)
    {
        services.AddScoped<ICompanyRepository, CompanyRepository>();
        services.AddScoped<ICompanyService, CompanyService>();
        return services;
    }
}
