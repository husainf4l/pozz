namespace PozzBackend.Modules.Activities.Domain;

public interface IActivityRepository
{
    Task<Activity?> GetByIdAsync(long id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Activity>> GetAllAsync(long companyId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Activity>> GetByInvestorIdAsync(long investorId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Activity>> GetByInvestmentIdAsync(long investmentId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Activity>> GetByProjectIdAsync(long projectId, CancellationToken cancellationToken = default);
    Task<(IReadOnlyList<Activity> Items, int TotalCount)> SearchAsync(
        long companyId,
        ActivityType? type = null,
        long? investorId = null,
        long? investmentId = null,
        long? projectId = null,
        DateOnly? fromDate = null,
        DateOnly? toDate = null,
        int page = 1,
        int pageSize = 20,
        CancellationToken cancellationToken = default);
    Task AddAsync(Activity activity, CancellationToken cancellationToken = default);
    Task UpdateAsync(Activity activity, CancellationToken cancellationToken = default);
    Task DeleteAsync(long id, CancellationToken cancellationToken = default);
}
