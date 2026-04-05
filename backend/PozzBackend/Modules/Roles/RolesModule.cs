using PozzBackend.Modules.Roles.Application.Services;
using PozzBackend.Modules.Roles.Infrastructure;

namespace PozzBackend.Modules.Roles;

public static class RolesModule
{
    public static IServiceCollection AddRolesModule(this IServiceCollection services)
    {
        services.AddScoped<IRoleService, RoleService>();
        return services;
    }
}
