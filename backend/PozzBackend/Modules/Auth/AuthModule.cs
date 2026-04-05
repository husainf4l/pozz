using PozzBackend.Modules.Auth.Application.Services;
using PozzBackend.Modules.Auth.Infrastructure;

namespace PozzBackend.Modules.Auth;

public static class AuthModule
{
    public static IServiceCollection AddAuthModule(this IServiceCollection services)
    {
        services.AddScoped<IAuthService, AuthService>();
        return services;
    }
}
