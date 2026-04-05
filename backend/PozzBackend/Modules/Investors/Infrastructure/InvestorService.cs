using PozzBackend.Common.Application;
using PozzBackend.Modules.Investors.Application.DTOs;
using PozzBackend.Modules.Investors.Application.Services;
using PozzBackend.Modules.Investors.Domain;

namespace PozzBackend.Modules.Investors.Infrastructure;

public class InvestorService : IInvestorService
{
    private readonly IInvestorRepository _repo;
    public InvestorService(IInvestorRepository repo) => _repo = repo;

    public async Task<Result<PagedResult<InvestorDto>>> GetAllAsync(
        int page, int pageSize, long? companyId = null, CancellationToken ct = default)
    {
        var (items, total) = await _repo.GetAllAsync(page, pageSize, companyId, ct);
        var dtos = items.Select(MapToDto);
        return Result<PagedResult<InvestorDto>>.Success(
            new PagedResult<InvestorDto>(dtos, total, page, pageSize));
    }

    public async Task<Result<InvestorDto>> GetByIdAsync(long id, CancellationToken ct = default)
    {
        var investor = await _repo.GetByIdAsync(id, ct);
        return investor is null
            ? Result<InvestorDto>.NotFound($"Investor {id} not found.")
            : Result<InvestorDto>.Success(MapToDto(investor));
    }

    public async Task<Result<InvestorDto>> GetByUserIdAsync(long userId, CancellationToken ct = default)
    {
        var investor = await _repo.GetByUserIdAsync(userId, ct);
        return investor is null
            ? Result<InvestorDto>.NotFound($"No investor profile found for user {userId}.")
            : Result<InvestorDto>.Success(MapToDto(investor));
    }

    public async Task<Result<InvestorDto>> CreateAsync(
        CreateInvestorRequest request, CancellationToken ct = default)
    {
        var investor = new Investor
        {
            UserId = request.UserId,
            CompanyId = request.CompanyId,
            InvestorType = request.InvestorType,
            Notes = request.Notes
        };

        await _repo.AddAsync(investor, ct);

        // reload with navigation properties
        var created = await _repo.GetByIdAsync(investor.Id, ct);
        return Result<InvestorDto>.Created(MapToDto(created!));
    }

    public async Task<Result<InvestorDto>> UpdateAsync(
        long id, UpdateInvestorRequest request, CancellationToken ct = default)
    {
        var investor = await _repo.GetByIdAsync(id, ct);
        if (investor is null) return Result<InvestorDto>.NotFound($"Investor {id} not found.");

        investor.CompanyId = request.CompanyId;
        investor.InvestorType = request.InvestorType;
        investor.Notes = request.Notes;
        investor.IsActive = request.IsActive;
        investor.UpdatedAt = DateTimeOffset.UtcNow;

        await _repo.UpdateAsync(investor, ct);
        return Result<InvestorDto>.Success(MapToDto(investor));
    }

    public async Task<Result<bool>> DeleteAsync(long id, CancellationToken ct = default)
    {
        var investor = await _repo.GetByIdAsync(id, ct);
        if (investor is null) return Result<bool>.NotFound($"Investor {id} not found.");

        investor.IsActive = false;
        investor.UpdatedAt = DateTimeOffset.UtcNow;
        await _repo.UpdateAsync(investor, ct);
        return Result<bool>.Success(true);
    }

    private static InvestorDto MapToDto(Investor i) => new(
        i.Id,
        i.UserId,
        i.User?.FullName ?? string.Empty,
        i.User?.Email ?? string.Empty,
        i.CompanyId,
        i.Company?.Name,
        i.InvestorType.ToString(),
        i.Notes,
        i.IsActive,
        i.CreatedAt,
        i.UpdatedAt);
}
