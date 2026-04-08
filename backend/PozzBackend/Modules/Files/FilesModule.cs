using Microsoft.Extensions.DependencyInjection;

namespace PozzBackend.Modules.Files;

public static class FilesModule
{
    public static IServiceCollection AddFilesModule(this IServiceCollection services)
    {
        // No additional services needed - using IStorageService from Common
        return services;
    }
}
