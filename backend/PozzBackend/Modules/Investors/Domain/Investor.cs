using PozzBackend.Common.Domain;
using PozzBackend.Modules.Auth.Domain;
using PozzBackend.Modules.Companies.Domain;

namespace PozzBackend.Modules.Investors.Domain;

public class Investor : AggregateRoot<long>
{
    public long UserId { get; set; }
    public long? CompanyId { get; set; }
    public InvestorType InvestorType { get; set; } = InvestorType.Individual;
    public string? Notes { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;

    public ApplicationUser User { get; set; } = null!;
    public Company? Company { get; set; }
}
