using System.ComponentModel.DataAnnotations;

namespace PozzBackend.Modules.Roles.Application.DTOs;

public record CreateRoleRequest(
    [Required] string Name,
    string? Description);

public record UpdateRoleRequest(
    [Required] string Name,
    string? Description);

public record AssignPermissionsRequest([Required] IList<string> Permissions);
