using Microsoft.EntityFrameworkCore;
using PozzBackend.Common.Infrastructure;
using PozzBackend.Modules.Projects.Domain;

namespace PozzBackend.Modules.Projects.Infrastructure;

public class ProjectRepository : IProjectRepository
{
    private readonly ApplicationDbContext _db;

    public ProjectRepository(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<Project?> GetByIdAsync(long id, CancellationToken ct = default)
    {
        return await _db.Projects
            .Include(p => p.Company)
            .FirstOrDefaultAsync(p => p.Id == id, ct);
    }

    public async Task<List<Project>> GetAllAsync(CancellationToken ct = default)
    {
        return await _db.Projects
            .Include(p => p.Company)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync(ct);
    }

    public async Task<List<Project>> GetByCompanyIdAsync(long companyId, CancellationToken ct = default)
    {
        return await _db.Projects
            .Include(p => p.Company)
            .Where(p => p.CompanyId == companyId)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync(ct);
    }

    public async Task<List<Project>> GetActiveProjectsAsync(CancellationToken ct = default)
    {
        return await _db.Projects
            .Include(p => p.Company)
            .Where(p => p.Status == ProjectStatus.Active && p.IsActive)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync(ct);
    }

    public async Task<Project> AddAsync(Project project, CancellationToken ct = default)
    {
        await _db.Projects.AddAsync(project, ct);
        await _db.SaveChangesAsync(ct);
        return project;
    }

    public async Task UpdateAsync(Project project, CancellationToken ct = default)
    {
        _db.Projects.Update(project);
        await _db.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(Project project, CancellationToken ct = default)
    {
        _db.Projects.Remove(project);
        await _db.SaveChangesAsync(ct);
    }
}
