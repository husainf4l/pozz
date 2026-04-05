namespace PozzBackend.Modules.Roles.Application.DTOs;

public record RoleDto(
    long Id,
    string Name,
    string? Description,
    IList<string> Permissions);
