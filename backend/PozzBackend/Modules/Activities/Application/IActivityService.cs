using PozzBackend.Common.Application;
using PozzBackend.Modules.Activities.Application;

namespace PozzBackend.Modules.Activities.Application;

public interface IActivityService
{
    Task<Result<ActivityDto>> GetByIdAsync(long id, CancellationToken cancellationToken = default);
    Task<Result<IReadOnlyList<ActivityDto>>> GetAllAsync(long companyId, CancellationToken cancellationToken = default);
    Task<Result<IReadOnlyList<ActivityDto>>> GetByInvestorIdAsync(long investorId, CancellationToken cancellationToken = default);
    Task<Result<IReadOnlyList<ActivityDto>>> GetByInvestmentIdAsync(long investmentId, CancellationToken cancellationToken = default);
    Task<Result<IReadOnlyList<ActivityDto>>> GetByProjectIdAsync(long projectId, CancellationToken cancellationToken = default);
    Task<Result<ActivitySearchResponse>> SearchAsync(ActivitySearchRequest request, CancellationToken cancellationToken = default);
    Task<Result<ActivityDto>> CreateAsync(CreateActivityRequest request, long userId, long companyId, CancellationToken cancellationToken = default);
    Task<Result<ActivityDto>> UpdateAsync(long id, UpdateActivityRequest request, long userId, CancellationToken cancellationToken = default);
    Task<Result<bool>> DeleteAsync(long id, CancellationToken cancellationToken = default);
}
