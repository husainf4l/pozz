using PozzBackend.Common.Domain;
using PozzBackend.Modules.Companies.Domain;

namespace PozzBackend.Modules.Projects.Domain;

public class Project : AggregateRoot<long>
{
    /// <summary>Project title/name</summary>
    public string Title { get; set; } = string.Empty;

    /// <summary>Full project description</summary>
    public string? Description { get; set; }

    /// <summary>Short summary for listings</summary>
    public string? Summary { get; set; }

    /// <summary>Industry/sector</summary>
    public string? Industry { get; set; }

   /// <summary>Location/region</summary>
    public string? Location { get; set; }

    /// <summary>Total funding goal amount</summary>
    public decimal FundingGoal { get; set; }

    /// <summary>Minimum investment amount per investor</summary>
    public decimal MinimumInvestment { get; set; }

    /// <summary>Current amount raised</summary>
    public decimal CurrentFunding { get; set; } = 0;

    /// <summary>Project status</summary>
    public ProjectStatus Status { get; set; } = ProjectStatus.Draft;

    /// <summary>Funding deadline</summary>
    public DateTimeOffset? FundingDeadline { get; set; }

    /// <summary>Expected return percentage</summary>
    public decimal? ExpectedReturn { get; set; }

    /// <summary>Project duration in months</summary>
    public int? DurationMonths { get; set; }

    /// <summary>Cover image URL</summary>
    public string? ImageUrl { get; set; }

    /// <summary>Document URLs (JSON array)</summary>
    public string? Documents { get; set; }

    /// <summary>Company that owns this project</summary>
    public long CompanyId { get; set; }
    public Company Company { get; set; } = null!;

    /// <summary>View count</summary>
    public int ViewCount { get; set; } = 0;

    public bool IsActive { get; set; } = true;
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
}
