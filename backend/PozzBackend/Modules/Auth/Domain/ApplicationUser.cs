using Microsoft.AspNetCore.Identity;

namespace PozzBackend.Modules.Auth.Domain;

public class ApplicationUser : IdentityUser<long>
{
    public string  FirstName   { get; set; } = string.Empty;
    public string  LastName    { get; set; } = string.Empty;
    public bool    IsActive    { get; set; } = true;

    // ── Extended profile (filled during onboarding) ────────────────────────
    public DateOnly? DateOfBirth { get; set; }
    public string?   Nationality { get; set; }
    public string?   Country     { get; set; }

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;

    public string FullName => $"{FirstName} {LastName}".Trim();
}
