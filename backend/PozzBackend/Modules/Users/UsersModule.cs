using PozzBackend.Modules.Users.Application.Services;
using PozzBackend.Modules.Users.Domain;
using PozzBackend.Modules.Users.Infrastructure;

namespace PozzBackend.Modules.Users;

public static class UsersModule
{
    public static IServiceCollection AddUsersModule(this IServiceCollection services)
    {
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IUserService, UserService>();
        return services;
    }
}
