namespace PozzBackend.Modules.Companies.Application.DTOs;

public record CompanyDto(
    long Id,
    string Name,
    string? Description,
    string? TaxNumber,
    string? Website,
    string? Email,
    string? Phone,
    bool IsActive,
    DateTimeOffset CreatedAt,
    DateTimeOffset UpdatedAt);
