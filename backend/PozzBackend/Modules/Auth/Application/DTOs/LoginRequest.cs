namespace PozzBackend.Modules.Auth.Application.DTOs;

public record LoginRequest(
    string Email,
    string Password);
