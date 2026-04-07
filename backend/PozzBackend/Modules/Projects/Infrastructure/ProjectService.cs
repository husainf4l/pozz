using Microsoft.EntityFrameworkCore;
using PozzBackend.Common.Application;
using PozzBackend.Common.Infrastructure;
using PozzBackend.Modules.Projects.Application.DTOs;
using PozzBackend.Modules.Projects.Domain;

namespace PozzBackend.Modules.Projects.Application.Services;

public class ProjectService : IProjectService
{
    private readonly IProjectRepository _repo;
    private readonly ApplicationDbContext _db;

    public ProjectService(IProjectRepository repo, ApplicationDbContext db)
    {
        _repo = repo;
        _db = db;
    }

    public async Task<Result<ProjectDto>> CreateProjectAsync(
        long userId, CreateProjectRequest request, CancellationToken ct = default)
    {
        // Get user's company
        var company = await _db.Companies.FirstOrDefaultAsync(c => c.OwnerId == userId, ct);
        if (company is null)
            return Result<ProjectDto>.Failure("You must complete company setup before creating projects.", 422);

        var project = new Project
        {
            Title = request.Title,
            Description = request.Description,
            Summary = request.Summary,
            Industry = request.Industry,
            Location = request.Location,
            FundingGoal = request.FundingGoal,
            MinimumInvestment = request.MinimumInvestment,
            FundingDeadline = request.FundingDeadline,
            ExpectedReturn = request.ExpectedReturn,
            DurationMonths = request.DurationMonths,
            ImageUrl = request.ImageUrl,
            CompanyId = company.Id,
            Status = ProjectStatus.Draft,
            CreatedAt = DateTimeOffset.UtcNow,
            UpdatedAt = DateTimeOffset.UtcNow
        };

        await _repo.AddAsync(project, ct);

        // Reload to get company
        project = await _repo.GetByIdAsync(project.Id, ct);
        return Result<ProjectDto>.Success(MapToDto(project!));
    }

    public async Task<Result<ProjectDto>> UpdateProjectAsync(
        long userId, long projectId, UpdateProjectRequest request, CancellationToken ct = default)
    {
        var project = await _repo.GetByIdAsync(projectId, ct);
        if (project is null)
            return Result<ProjectDto>.NotFound("Project not found.");

        // Verify ownership
        var company = await _db.Companies.FirstOrDefaultAsync(c => c.Id == project.CompanyId, ct);
        if (company?.OwnerId != userId)
            return Result<ProjectDto>.Failure("You don't have permission to update this project.", 403);

        // Update fields
        if (request.Title is not null) project.Title = request.Title;
        if (request.Description is not null) project.Description = request.Description;
        if (request.Summary is not null) project.Summary = request.Summary;
        if (request.Industry is not null) project.Industry = request.Industry;
        if (request.Location is not null) project.Location = request.Location;
        if (request.FundingGoal.HasValue) project.FundingGoal = request.FundingGoal.Value;
        if (request.MinimumInvestment.HasValue) project.MinimumInvestment = request.MinimumInvestment.Value;
        if (request.FundingDeadline.HasValue) project.FundingDeadline = request.FundingDeadline;
        if (request.ExpectedReturn.HasValue) project.ExpectedReturn = request.ExpectedReturn;
        if (request.DurationMonths.HasValue) project.DurationMonths = request.DurationMonths;
        if (request.ImageUrl is not null) project.ImageUrl = request.ImageUrl;
        if (request.Status.HasValue) project.Status = request.Status.Value;

        project.UpdatedAt = DateTimeOffset.UtcNow;
        await _repo.UpdateAsync(project, ct);

        return Result<ProjectDto>.Success(MapToDto(project));
    }

    public async Task<Result<ProjectDto>> GetProjectByIdAsync(long projectId, CancellationToken ct = default)
    {
        var project = await _repo.GetByIdAsync(projectId, ct);
        if (project is null)
            return Result<ProjectDto>.NotFound("Project not found.");

        // Increment view count
        project.ViewCount++;
        await _repo.UpdateAsync(project, ct);

        return Result<ProjectDto>.Success(MapToDto(project));
    }

    public async Task<Result<List<ProjectDto>>> GetAllProjectsAsync(CancellationToken ct = default)
    {
        var projects = await _repo.GetAllAsync(ct);
        var dtos = projects.Select(MapToDto).ToList();
        return Result<List<ProjectDto>>.Success(dtos);
    }

    public async Task<Result<List<ProjectDto>>> GetMyProjectsAsync(long userId, CancellationToken ct = default)
    {
        var company = await _db.Companies.FirstOrDefaultAsync(c => c.OwnerId == userId, ct);
        if (company is null)
            return Result<List<ProjectDto>>.Success(new List<ProjectDto>());

        var projects = await _repo.GetByCompanyIdAsync(company.Id, ct);
        var dtos = projects.Select(MapToDto).ToList();
        return Result<List<ProjectDto>>.Success(dtos);
    }

    public async Task<Result<List<ProjectDto>>> GetActiveProjectsAsync(CancellationToken ct = default)
    {
        var projects = await _repo.GetActiveProjectsAsync(ct);
        var dtos = projects.Select(MapToDto).ToList();
        return Result<List<ProjectDto>>.Success(dtos);
    }

    public async Task<Result<bool>> DeleteProjectAsync(long userId, long projectId, CancellationToken ct = default)
    {
        var project = await _repo.GetByIdAsync(projectId, ct);
        if (project is null)
            return Result<bool>.NotFound("Project not found.");

        // Verify ownership
        var company = await _db.Companies.FirstOrDefaultAsync(c => c.Id == project.CompanyId, ct);
        if (company?.OwnerId != userId)
            return Result<bool>.Failure("You don't have permission to delete this project.", 403);

        await _repo.DeleteAsync(project, ct);
        return Result<bool>.Success(true);
    }

    private static ProjectDto MapToDto(Project p) => new(
        p.Id,
        p.Title,
        p.Description,
        p.Summary,
        p.Industry,
        p.Location,
        p.FundingGoal,
        p.MinimumInvestment,
        p.CurrentFunding,
        p.Status,
        p.FundingDeadline,
        p.ExpectedReturn,
        p.DurationMonths,
        p.ImageUrl,
        p.CompanyId,
        p.Company?.Name ?? "",
        p.ViewCount,
        p.CreatedAt,
        p.UpdatedAt);
}
