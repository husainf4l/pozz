using Microsoft.AspNetCore.Authorization;

namespace PozzBackend.Common.Infrastructure.Authorization;

/// <summary>
/// Declarative permission check. Usage: [HasPermission(PermissionConstants.Users.Read)]
/// </summary>
public class HasPermissionAttribute : AuthorizeAttribute
{
    public HasPermissionAttribute(string permission) : base(policy: permission) { }
}
