using PozzBackend.Common.Domain;
using PozzBackend.Modules.Auth.Domain;

namespace PozzBackend.Modules.Onboarding.Domain;

/// <summary>
/// Tracks a user's onboarding progress. One record per user.
/// </summary>
public class UserOnboarding : AggregateRoot<long>
{
    public long           UserId         { get; set; }
    public OnboardingRole OnboardingRole { get; set; }
    public OnboardingStatus Status       { get; set; } = OnboardingStatus.NotStarted;

    /// <summary>Keys of steps already completed (stored as TEXT[] in Postgres).</summary>
    public string[] CompletedSteps { get; set; } = [];

    public DateTimeOffset? CompletedAt { get; set; }
    public DateTimeOffset  CreatedAt   { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset  UpdatedAt   { get; set; } = DateTimeOffset.UtcNow;

    public ApplicationUser User { get; set; } = null!;

    // ── Domain behaviour ───────────────────────────────────────────────────

    public bool HasStep(string step) => CompletedSteps.Contains(step);

    /// <summary>
    /// Marks a step complete and recalculates overall status.
    /// </summary>
    public void CompleteStep(string step)
    {
        if (!HasStep(step))
            CompletedSteps = [.. CompletedSteps, step];

        var required = OnboardingSteps.GetRequiredFor(OnboardingRole);

        Status = required.All(HasStep)
            ? OnboardingStatus.Completed
            : OnboardingStatus.InProgress;

        if (Status == OnboardingStatus.Completed && CompletedAt is null)
            CompletedAt = DateTimeOffset.UtcNow;

        UpdatedAt = DateTimeOffset.UtcNow;
    }

    /// <summary>Returns the first incomplete required step, or null when done.</summary>
    public string? GetCurrentStep()
        => OnboardingSteps.GetRequiredFor(OnboardingRole).FirstOrDefault(s => !HasStep(s));
}
