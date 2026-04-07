using PozzBackend.Common.Application;
using PozzBackend.Modules.Projects.Application.DTOs;

namespace PozzBackend.Modules.Projects.Application.Services;

public interface IProjectService
{
    Task<Result<ProjectDto>> CreateProjectAsync(long userId, CreateProjectRequest request, CancellationToken ct = default);
    Task<Result<ProjectDto>> UpdateProjectAsync(long userId, long projectId, UpdateProjectRequest request, CancellationToken ct = default);
    Task<Result<ProjectDto>> GetProjectByIdAsync(long projectId, CancellationToken ct = default);
    Task<Result<List<ProjectDto>>> GetAllProjectsAsync(CancellationToken ct = default);
    Task<Result<List<ProjectDto>>> GetMyProjectsAsync(long userId, CancellationToken ct = default);
    Task<Result<List<ProjectDto>>> GetActiveProjectsAsync(CancellationToken ct = default);
    Task<Result<bool>> DeleteProjectAsync(long userId, long projectId, CancellationToken ct = default);
}
