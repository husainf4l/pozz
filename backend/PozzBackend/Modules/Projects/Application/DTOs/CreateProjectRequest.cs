using System.ComponentModel.DataAnnotations;
using PozzBackend.Modules.Projects.Domain;

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
    string? ImageUrl,
    // Enhanced fields
    ProjectStage? Stage,
    ProjectGoal? PrimaryGoal,
    [MaxLength(500)] string? WebsiteUrl,
    [MaxLength(500)] string? PitchDeckUrl,
    [MaxLength(2000)] string? InternalNotes,
    [MaxLength(500)] string? Tags,
    [MaxLength(200)] string? TargetMarket,
    BusinessModel? BusinessModel,
    [MaxLength(300)] string? CurrentStatusSummary);

