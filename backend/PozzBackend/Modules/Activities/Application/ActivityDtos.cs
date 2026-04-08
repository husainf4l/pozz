using PozzBackend.Modules.Activities.Domain;

namespace PozzBackend.Modules.Activities.Application;

public record ActivityDto
{
    public long Id { get; init; }
    public long CompanyId { get; init; }
    public ActivityType Type { get; init; }
    public string TypeLabel { get; init; } = string.Empty;
    public string Title { get; init; } = string.Empty;
    public string? Description { get; init; }
    
    public long? InvestorId { get; init; }
    public string? InvestorName { get; init; }
    public long? InvestmentId { get; init; }
    public long? ProjectId { get; init; }
    public string? ProjectName { get; init; }
    
    public DateTimeOffset ActivityDate { get; init; }
    public string? Outcome { get; init; }
    public string? NextSteps { get; init; }
    public DateOnly? FollowUpDate { get; init; }
    
    public string? EmailSubject { get; init; }
    public string? EmailRecipients { get; init; }
    public int? CallDurationMinutes { get; init; }
    public string? MeetingLocation { get; init; }
    public string? MeetingAttendees { get; init; }
    
    public string? DocumentUrl { get; init; }
    public string? DocumentName { get; init; }
    
    public DateTimeOffset CreatedAt { get; init; }
    public DateTimeOffset UpdatedAt { get; init; }
    public long CreatedBy { get; init; }
    public string CreatedByName { get; init; } = string.Empty;
    public bool IsPrivate { get; init; }
}

public record CreateActivityRequest
{
    public ActivityType Type { get; init; }
    public string Title { get; init; } = string.Empty;
    public string? Description { get; init; }
    
    public long? InvestorId { get; init; }
    public long? InvestmentId { get; init; }
    public long? ProjectId { get; init; }
    
    public DateTimeOffset? ActivityDate { get; init; }
    public string? Outcome { get; init; }
    public string? NextSteps { get; init; }
    public DateOnly? FollowUpDate { get; init; }
    
    public string? EmailSubject { get; init; }
    public string? EmailRecipients { get; init; }
    public int? CallDurationMinutes { get; init; }
    public string? MeetingLocation { get; init; }
    public string? MeetingAttendees { get; init; }
    
    public string? DocumentUrl { get; init; }
    public string? DocumentName { get; init; }
    public bool IsPrivate { get; init; }
}

public record UpdateActivityRequest
{
    public string Title { get; init; } = string.Empty;
    public string? Description { get; init; }
    public DateTimeOffset? ActivityDate { get; init; }
    public string? Outcome { get; init; }
    public string? NextSteps { get; init; }
    public DateOnly? FollowUpDate { get; init; }
    public bool IsPrivate { get; init; }
}

public record ActivitySearchRequest
{
    public long CompanyId { get; init; }
    public ActivityType? Type { get; init; }
    public long? InvestorId { get; init; }
    public long? InvestmentId { get; init; }
    public long? ProjectId { get; init; }
    public DateOnly? FromDate { get; init; }
    public DateOnly? ToDate { get; init; }
    public int Page { get; init; } = 1;
    public int PageSize { get; init; } = 20;
}

public record ActivitySearchResponse
{
    public IReadOnlyList<ActivityDto> Items { get; init; } = Array.Empty<ActivityDto>();
    public int TotalCount { get; init; }
    public int Page { get; init; }
    public int PageSize { get; init; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
}
