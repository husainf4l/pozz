namespace PozzBackend.Modules.Projects.Domain;

public interface IProjectRepository
{
    Task<Project?> GetByIdAsync(long id, CancellationToken ct = default);
    Task<List<Project>> GetAllAsync(CancellationToken ct = default);
    Task<List<Project>> GetByCompanyIdAsync(long companyId, CancellationToken ct = default);
    Task<List<Project>> GetActiveProjectsAsync(CancellationToken ct = default);
    Task<Project> AddAsync(Project project, CancellationToken ct = default);
    Task UpdateAsync(Project project, CancellationToken ct = default);
    Task DeleteAsync(Project project, CancellationToken ct = default);
}
