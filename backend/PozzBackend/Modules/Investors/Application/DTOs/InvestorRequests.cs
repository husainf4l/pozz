using System.ComponentModel.DataAnnotations;
using PozzBackend.Modules.Investors.Domain;

namespace PozzBackend.Modules.Investors.Application.DTOs;

public record CreateInvestorRequest(
    [Required] long UserId,
    long? CompanyId,
    [Required] InvestorType InvestorType,
    string? Notes);

public record UpdateInvestorRequest(
    long? CompanyId,
    [Required] InvestorType InvestorType,
    string? Notes,
    bool IsActive);
