namespace PozzBackend.Modules.Auth.Application.DTOs;

public record AuthResponse(
    string AccessToken,
    string RefreshToken,
    DateTimeOffset ExpiresAt,
    UserInfoDto User,
    OnboardingSummaryDto Onboarding);

public record UserInfoDto(
    long Id,
    string Email,
    string FirstName,
    string LastName,
    IList<string> Roles);

/// <summary>Included in every login/register response so the frontend knows where to redirect.</summary>
public record OnboardingSummaryDto(
    bool   IsComplete,
    string Role,
    string Status,
    string? CurrentStep,
    string? CurrentStepLabel);
