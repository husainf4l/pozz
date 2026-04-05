namespace PozzBackend.Modules.Users.Application.DTOs;

public record UserDto(
    long Id,
    string Email,
    string FirstName,
    string LastName,
    bool IsActive,
    IList<string> Roles,
    DateTimeOffset CreatedAt,
    DateTimeOffset UpdatedAt);
