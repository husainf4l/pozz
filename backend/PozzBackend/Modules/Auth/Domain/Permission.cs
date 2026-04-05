using PozzBackend.Common.Domain;

namespace PozzBackend.Modules.Auth.Domain;

public class Permission : Entity<long>
{
    public string Name { get; set; } = string.Empty;          // e.g. "users.read"
    public string? Description { get; set; }
    public string Module { get; set; } = string.Empty;        // e.g. "Users"

    public ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
}
