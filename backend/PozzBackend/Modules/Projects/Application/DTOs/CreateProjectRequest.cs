using System.ComponentModel.DataAnnotations;

namespace PozzBackend.Modules.Projects.Application.DTOs;

public record CreateProjectRequest(
    [Required][MaxLength(200)] string Title,
    [MaxLength(5000)] string? Description,
    [MaxLength(500)] string? Summary,
    string? Industry,
    string? Location,
    [Range(0, double.MaxValue)] decimal FundingGoal,
    [Range(0, double.MaxValue)] decimal MinimumInvestment,
    DateTimeOffset? FundingDeadline,
    decimal? ExpectedReturn,
    int? DurationMonths,
    string? ImageUrl);
