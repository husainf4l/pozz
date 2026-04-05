using System.ComponentModel.DataAnnotations;

namespace PozzBackend.Modules.Users.Application.DTOs;

public record UpdateUserRequest(
    [Required] string FirstName,
    [Required] string LastName,
    bool IsActive);
