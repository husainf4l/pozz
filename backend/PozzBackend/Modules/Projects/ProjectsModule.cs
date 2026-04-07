using Microsoft.Extensions.DependencyInjection;
using PozzBackend.Modules.Projects.Application.Services;
using PozzBackend.Modules.Projects.Domain;
using PozzBackend.Modules.Projects.Infrastructure;

namespace PozzBackend.Modules.Projects;

public static class ProjectsModule
{
    public static IServiceCollection AddProjectsModule(this IServiceCollection services)
    {
        services.AddScoped<IProjectRepository, ProjectRepository>();
        services.AddScoped<IProjectService, ProjectService>();
        return services;
    }
}
