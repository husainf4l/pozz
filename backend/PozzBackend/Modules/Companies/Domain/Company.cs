using PozzBackend.Common.Domain;
using PozzBackend.Modules.Auth.Domain;
using PozzBackend.Modules.Investors.Domain;

namespace PozzBackend.Modules.Companies.Domain;

public class Company : AggregateRoot<long>
{
    public string  Name               { get; set; } = string.Empty;
    public string? Description        { get; set; }
    public string? RegistrationNumber { get; set; } // Company registration / commercial number
    public string? Industry           { get; set; } // e.g. "Technology", "Real Estate"
    public string? TaxNumber          { get; set; }
    public string? Website            { get; set; }
    public string? Email              { get; set; }
    public string? Phone              { get; set; }
    public bool    IsActive           { get; set; } = true;

    /// <summary>The ProjectOwner user who owns / manages this company.</summary>
    public long?   OwnerId            { get; set; }
    public ApplicationUser? Owner     { get; set; }

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;

    public ICollection<Investor> Investors { get; set; } = new List<Investor>();
}
