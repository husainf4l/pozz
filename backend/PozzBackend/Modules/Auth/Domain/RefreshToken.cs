using PozzBackend.Common.Domain;

namespace PozzBackend.Modules.Auth.Domain;

public class RefreshToken : Entity<long>
{
    public string Token { get; set; } = string.Empty;
    public long UserId { get; set; }
    public DateTimeOffset ExpiresAt { get; set; }
    public bool IsRevoked { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public ApplicationUser User { get; set; } = null!;

    public bool IsExpired => DateTimeOffset.UtcNow >= ExpiresAt;
    public bool IsActive => !IsRevoked && !IsExpired;
}
