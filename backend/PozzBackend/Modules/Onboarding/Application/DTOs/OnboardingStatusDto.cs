namespace PozzBackend.Modules.Onboarding.Application.DTOs;

public record OnboardingStatusDto(
    string  Role,          // "Investor" | "ProjectOwner"
    string  Status,        // "NotStarted" | "InProgress" | "Completed"
    bool    IsComplete,
    string? CurrentStep,
    string? CurrentStepLabel,
    IList<OnboardingStepDto> Steps,
    DateTimeOffset? CompletedAt);

public record OnboardingStepDto(
    string Key,
    string Label,
    bool   IsCompleted,
    bool   IsRequired,
    bool   IsCurrent);
