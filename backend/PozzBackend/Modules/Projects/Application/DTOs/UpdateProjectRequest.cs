using System.ComponentModel.DataAnnotations;
using PozzBackend.Modules.Projects.Domain;

namespace PozzBackend.Modules.Projects.Application.DTOs;

public record UpdateProjectRequest(
    [MaxLength(200)] string? Title,
    [MaxLength(5000)] string? Description,
    [MaxLength(500)] string? Summary,
    string? Industry,
    string? Location,
    decimal? FundingGoal,
    decimal? MinimumInvestment,
    DateTimeOffset? FundingDeadline,
    decimal? ExpectedReturn,
    int? DurationMonths,
    string? ImageUrl,
    ProjectStatus? Status);
