using System.ComponentModel.DataAnnotations;

namespace PozzBackend.Modules.Users.Application.DTOs;

public record AssignRoleRequest([Required] string RoleName);
