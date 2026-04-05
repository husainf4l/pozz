using Microsoft.AspNetCore.Authorization;

namespace PozzBackend.Common.Infrastructure.Authorization;

/// <summary>
/// Checks whether the authenticated user's JWT claims contain the required permission.
/// Permissions are embedded as "permission" claims during login — no DB round-trip needed.
/// </summary>
public class PermissionAuthorizationHandler : AuthorizationHandler<PermissionRequirement>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        PermissionRequirement requirement)
    {
        var hasPermission = context.User.Claims
            .Where(c => c.Type == "permission")
            .Any(c => c.Value == requirement.Permission);

        if (hasPermission)
            context.Succeed(requirement);

        return Task.CompletedTask;
    }
}
