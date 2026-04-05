namespace PozzBackend.Modules.Investors.Application.DTOs;

public record InvestorDto(
    long Id,
    long UserId,
    string UserFullName,
    string UserEmail,
    long? CompanyId,
    string? CompanyName,
    string InvestorType,
    string? Notes,
    bool IsActive,
    DateTimeOffset CreatedAt,
    DateTimeOffset UpdatedAt);
