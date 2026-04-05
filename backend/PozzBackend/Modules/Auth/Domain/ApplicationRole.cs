using Microsoft.AspNetCore.Identity;

namespace PozzBackend.Modules.Auth.Domain;

public class ApplicationRole : IdentityRole<long>
{
    public string? Description { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();

    public ApplicationRole() { }
    public ApplicationRole(string name) : base(name) { }
}
