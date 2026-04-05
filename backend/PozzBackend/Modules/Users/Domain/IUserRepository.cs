using PozzBackend.Modules.Auth.Domain;

namespace PozzBackend.Modules.Users.Domain;

public interface IUserRepository
{
    Task<ApplicationUser?> GetByIdAsync(long id, CancellationToken ct = default);
    Task<ApplicationUser?> GetByEmailAsync(string email, CancellationToken ct = default);
    Task<(IEnumerable<ApplicationUser> Items, int TotalCount)> GetAllAsync(
        int page, int pageSize, CancellationToken ct = default);
}
