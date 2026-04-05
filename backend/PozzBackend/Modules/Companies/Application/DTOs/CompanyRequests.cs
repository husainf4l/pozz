using System.ComponentModel.DataAnnotations;

namespace PozzBackend.Modules.Companies.Application.DTOs;

public record CreateCompanyRequest(
    [Required] string Name,
    string? Description,
    string? TaxNumber,
    string? Website,
    [EmailAddress] string? Email,
    string? Phone);

public record UpdateCompanyRequest(
    [Required] string Name,
    string? Description,
    string? TaxNumber,
    string? Website,
    [EmailAddress] string? Email,
    string? Phone,
    bool IsActive);
