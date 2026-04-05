namespace PozzBackend.Modules.Auth.Domain;

public class RolePermission
{
    public long RoleId { get; set; }
    public long PermissionId { get; set; }

    public ApplicationRole Role { get; set; } = null!;
    public Permission Permission { get; set; } = null!;
}
