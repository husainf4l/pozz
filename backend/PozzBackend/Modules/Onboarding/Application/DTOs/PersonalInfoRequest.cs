using System.ComponentModel.DataAnnotations;

namespace PozzBackend.Modules.Onboarding.Application.DTOs;

/// <summary>Submitted for the "personal_info" step (applies to all roles).</summary>
public record PersonalInfoRequest(
    [Required] string FirstName,
    [Required] string LastName,
    string? PhoneNumber,
    DateOnly? DateOfBirth,
    string? Nationality,
    string? Country);
