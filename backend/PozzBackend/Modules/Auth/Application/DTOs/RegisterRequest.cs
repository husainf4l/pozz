using System.ComponentModel.DataAnnotations;

namespace PozzBackend.Modules.Auth.Application.DTOs;

public record RegisterRequest(
    [Required] string FirstName,
    [Required] string LastName,
    [Required][EmailAddress] string Email,
    [Required][MinLength(8)] string Password,
    /// <summary>"Investor" (default) or "ProjectOwner"</summary>
    string Role = "Investor");
