using PozzBackend.Common.Domain;

namespace PozzBackend.Modules.Activities.Domain;

public class Activity : AggregateRoot<long>
{
    // ── Core Activity Info ─────────────────────────────────────────────────────
    public long CompanyId { get; set; }
    public ActivityType Type { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    
    // ── Related Entities ───────────────────────────────────────────────────────
    public long? InvestorId { get; set; }
    public long? InvestmentId { get; set; }
    public long? ProjectId { get; set; }
    
    // ── Activity Details ───────────────────────────────────────────────────────
    public DateTimeOffset ActivityDate { get; set; } = DateTimeOffset.UtcNow;
    public string? Outcome { get; set; }
    public string? NextSteps { get; set; }
    public DateOnly? FollowUpDate { get; set; }
    
    // ── Email/Call Specific ────────────────────────────────────────────────────
    public string? EmailSubject { get; set; }
    public string? EmailRecipients { get; set; }
    public int? CallDurationMinutes { get; set; }
    
    // ── Meeting Specific ───────────────────────────────────────────────────────
    public string? MeetingLocation { get; set; }
    public string? MeetingAttendees { get; set; }
    
    // ── Document Reference ─────────────────────────────────────────────────────
    public string? DocumentUrl { get; set; }
    public string? DocumentName { get; set; }
    
    // ── Metadata ───────────────────────────────────────────────────────────────
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
    public long CreatedBy { get; set; }
    public long? LastModifiedBy { get; set; }
    public bool IsPrivate { get; set; } = false;
}
