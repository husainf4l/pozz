using PozzBackend.Modules.Activities.Application;
using PozzBackend.Modules.Activities.Domain;
using PozzBackend.Modules.Activities.Infrastructure;

namespace PozzBackend.Modules.Activities;

public static class ActivitiesModule
{
    public static IServiceCollection AddActivitiesModule(this IServiceCollection services)
    {
        services.AddScoped<IActivityRepository, ActivityRepository>();
        services.AddScoped<IActivityService, ActivityService>();
        return services;
    }
}
