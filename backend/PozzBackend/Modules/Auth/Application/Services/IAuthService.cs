using PozzBackend.Common.Application;
using PozzBackend.Modules.Auth.Application.DTOs;

namespace PozzBackend.Modules.Auth.Application.Services;

public interface IAuthService
{
    Task<Result<AuthResponse>> RegisterAsync(RegisterRequest request, CancellationToken ct = default);
    Task<Result<AuthResponse>> LoginAsync(LoginRequest request, CancellationToken ct = default);
    Task<Result<AuthResponse>> RefreshTokenAsync(string refreshToken, CancellationToken ct = default);
    Task<Result<bool>> RevokeTokenAsync(string refreshToken, CancellationToken ct = default);
}
