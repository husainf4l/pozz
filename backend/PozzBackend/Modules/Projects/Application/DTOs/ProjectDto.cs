using PozzBackend.Modules.Projects.Domain;

namespace PozzBackend.Modules.Projects.Application.DTOs;

public record ProjectDto(
    long Id,
    string Title,
    string? Description,
    string? Summary,
    string? Industry,
    string? Location,
    decimal FundingGoal,
    decimal MinimumInvestment,
    decimal CurrentFunding,
    ProjectStatus Status,
    DateTimeOffset? FundingDeadline,
    decimal? ExpectedReturn,
    int? DurationMonths,
    string? ImageUrl,
    long CompanyId,
    string CompanyName,
    int ViewCount,
    DateTimeOffset CreatedAt,
    DateTimeOffset UpdatedAt);
