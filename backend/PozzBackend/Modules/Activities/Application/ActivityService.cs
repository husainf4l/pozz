using Microsoft.EntityFrameworkCore;
using PozzBackend.Common.Application;
using PozzBackend.Common.Infrastructure;
using PozzBackend.Modules.Activities.Domain;

namespace PozzBackend.Modules.Activities.Application;

public class ActivityService : IActivityService
{
    private readonly IActivityRepository _repository;
    private readonly ApplicationDbContext _context;

    public ActivityService(IActivityRepository repository, ApplicationDbContext context)
    {
        _repository = repository;
        _context = context;
    }

    public async Task<Result<ActivityDto>> GetByIdAsync(long id, CancellationToken cancellationToken = default)
    {
        var activity = await _repository.GetByIdAsync(id, cancellationToken);
        if (activity == null)
            return Result<ActivityDto>.Failure("Activity not found", 404);

        var dto = await MapToDto(activity);
        return Result<ActivityDto>.Success(dto);
    }

    public async Task<Result<IReadOnlyList<ActivityDto>>> GetAllAsync(long companyId, CancellationToken cancellationToken = default)
    {
        var activities = await _repository.GetAllAsync(companyId, cancellationToken);
        var dtos = new List<ActivityDto>();
        foreach (var activity in activities)
        {
            dtos.Add(await MapToDto(activity));
        }
        return Result<IReadOnlyList<ActivityDto>>.Success(dtos);
    }

    public async Task<Result<IReadOnlyList<ActivityDto>>> GetByInvestorIdAsync(long investorId, CancellationToken cancellationToken = default)
    {
        var activities = await _repository.GetByInvestorIdAsync(investorId, cancellationToken);
        var dtos = new List<ActivityDto>();
        foreach (var activity in activities)
        {
            dtos.Add(await MapToDto(activity));
        }
        return Result<IReadOnlyList<ActivityDto>>.Success(dtos);
    }

    public async Task<Result<IReadOnlyList<ActivityDto>>> GetByInvestmentIdAsync(long investmentId, CancellationToken cancellationToken = default)
    {
        var activities = await _repository.GetByInvestmentIdAsync(investmentId, cancellationToken);
        var dtos = new List<ActivityDto>();
        foreach (var activity in activities)
        {
            dtos.Add(await MapToDto(activity));
        }
        return Result<IReadOnlyList<ActivityDto>>.Success(dtos);
    }

    public async Task<Result<IReadOnlyList<ActivityDto>>> GetByProjectIdAsync(long projectId, CancellationToken cancellationToken = default)
    {
        var activities = await _repository.GetByProjectIdAsync(projectId, cancellationToken);
        var dtos = new List<ActivityDto>();
        foreach (var activity in activities)
        {
            dtos.Add(await MapToDto(activity));
        }
        return Result<IReadOnlyList<ActivityDto>>.Success(dtos);
    }

    public async Task<Result<ActivitySearchResponse>> SearchAsync(ActivitySearchRequest request, CancellationToken cancellationToken = default)
    {
        var (items, totalCount) = await _repository.SearchAsync(
            request.CompanyId,
            request.Type,
            request.InvestorId,
            request.InvestmentId,
            request.ProjectId,
            request.FromDate,
            request.ToDate,
            request.Page,
            request.PageSize,
            cancellationToken);

        var dtos = new List<ActivityDto>();
        foreach (var activity in items)
        {
            dtos.Add(await MapToDto(activity));
        }

        var response = new ActivitySearchResponse
        {
            Items = dtos,
            TotalCount = totalCount,
            Page = request.Page,
            PageSize = request.PageSize
        };

        return Result<ActivitySearchResponse>.Success(response);
    }

    public async Task<Result<ActivityDto>> CreateAsync(CreateActivityRequest request, long userId, long companyId, CancellationToken cancellationToken = default)
    {
        var activity = new Activity
        {
            CompanyId = companyId,
            Type = request.Type,
            Title = request.Title,
            Description = request.Description,
            InvestorId = request.InvestorId,
            InvestmentId = request.InvestmentId,
            ProjectId = request.ProjectId,
            ActivityDate = request.ActivityDate ?? DateTimeOffset.UtcNow,
            Outcome = request.Outcome,
            NextSteps = request.NextSteps,
            FollowUpDate = request.FollowUpDate,
            EmailSubject = request.EmailSubject,
            EmailRecipients = request.EmailRecipients,
            CallDurationMinutes = request.CallDurationMinutes,
            MeetingLocation = request.MeetingLocation,
            MeetingAttendees = request.MeetingAttendees,
            DocumentUrl = request.DocumentUrl,
            DocumentName = request.DocumentName,
            IsPrivate = request.IsPrivate,
            CreatedBy = userId,
            CreatedAt = DateTimeOffset.UtcNow,
            UpdatedAt = DateTimeOffset.UtcNow
        };

        await _repository.AddAsync(activity, cancellationToken);
        var dto = await MapToDto(activity);
        return Result<ActivityDto>.Created(dto);
    }

    public async Task<Result<ActivityDto>> UpdateAsync(long id, UpdateActivityRequest request, long userId, CancellationToken cancellationToken = default)
    {
        var activity = await _repository.GetByIdAsync(id, cancellationToken);
        if (activity == null)
            return Result<ActivityDto>.Failure("Activity not found", 404);

        activity.Title = request.Title;
        activity.Description = request.Description;
        activity.ActivityDate = request.ActivityDate ?? activity.ActivityDate;
        activity.Outcome = request.Outcome;
        activity.NextSteps = request.NextSteps;
        activity.FollowUpDate = request.FollowUpDate;
        activity.IsPrivate = request.IsPrivate;
        activity.LastModifiedBy = userId;
        activity.UpdatedAt = DateTimeOffset.UtcNow;

        await _repository.UpdateAsync(activity, cancellationToken);
        var dto = await MapToDto(activity);
        return Result<ActivityDto>.Success(dto);
    }

    public async Task<Result<bool>> DeleteAsync(long id, CancellationToken cancellationToken = default)
    {
        var activity = await _repository.GetByIdAsync(id, cancellationToken);
        if (activity == null)
            return Result<bool>.Failure("Activity not found", 404);

        await _repository.DeleteAsync(id, cancellationToken);
        return Result<bool>.Success(true);
    }

    private async Task<ActivityDto> MapToDto(Activity activity)
    {
        string? investorName = null;
        string? projectName = null;
        string createdByName = "Unknown";

        if (activity.InvestorId.HasValue)
        {
            var investor = await _context.Investors
                .Include(i => i.User)
                .FirstOrDefaultAsync(i => i.Id == activity.InvestorId.Value);
            investorName = investor?.User?.FullName;
        }

        if (activity.ProjectId.HasValue)
        {
            var project = await _context.Projects
                .FirstOrDefaultAsync(p => p.Id == activity.ProjectId.Value);
            projectName = project?.Title;
        }

        var creator = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == activity.CreatedBy);
        if (creator != null)
        {
            createdByName = $"{creator.FirstName} {creator.LastName}";
        }

        return new ActivityDto
        {
            Id = activity.Id,
            CompanyId = activity.CompanyId,
            Type = activity.Type,
            TypeLabel = GetActivityTypeLabel(activity.Type),
            Title = activity.Title,
            Description = activity.Description,
            InvestorId = activity.InvestorId,
            InvestorName = investorName,
            InvestmentId = activity.InvestmentId,
            ProjectId = activity.ProjectId,
            ProjectName = projectName,
            ActivityDate = activity.ActivityDate,
            Outcome = activity.Outcome,
            NextSteps = activity.NextSteps,
            FollowUpDate = activity.FollowUpDate,
            EmailSubject = activity.EmailSubject,
            EmailRecipients = activity.EmailRecipients,
            CallDurationMinutes = activity.CallDurationMinutes,
            MeetingLocation = activity.MeetingLocation,
            MeetingAttendees = activity.MeetingAttendees,
            DocumentUrl = activity.DocumentUrl,
            DocumentName = activity.DocumentName,
            CreatedAt = activity.CreatedAt,
            UpdatedAt = activity.UpdatedAt,
            CreatedBy = activity.CreatedBy,
            CreatedByName = createdByName,
            IsPrivate = activity.IsPrivate
        };
    }

    private static string GetActivityTypeLabel(ActivityType type)
    {
        return type switch
        {
            ActivityType.Note => "Note",
            ActivityType.Email => "Email",
            ActivityType.PhoneCall => "Phone Call",
            ActivityType.Meeting => "Meeting",
            ActivityType.InvestmentUpdated => "Investment Updated",
            ActivityType.InvestorUpdated => "Investor Updated",
            ActivityType.DocumentUploaded => "Document Uploaded",
            ActivityType.StatusChanged => "Status Changed",
            ActivityType.PaymentReceived => "Payment Received",
            ActivityType.FollowUpScheduled => "Follow-up Scheduled",
            ActivityType.Other => "Other",
            _ => "Unknown"
        };
    }
}
