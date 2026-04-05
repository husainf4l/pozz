using PozzBackend.Common.Application;
using PozzBackend.Modules.Companies.Application.DTOs;
using PozzBackend.Modules.Companies.Application.Services;
using PozzBackend.Modules.Companies.Domain;

namespace PozzBackend.Modules.Companies.Infrastructure;

public class CompanyService : ICompanyService
{
    private readonly ICompanyRepository _repo;
    public CompanyService(ICompanyRepository repo) => _repo = repo;

    public async Task<Result<PagedResult<CompanyDto>>> GetAllAsync(
        int page, int pageSize, CancellationToken ct = default)
    {
        var (items, total) = await _repo.GetAllAsync(page, pageSize, ct);
        var dtos = items.Select(MapToDto);
        return Result<PagedResult<CompanyDto>>.Success(new PagedResult<CompanyDto>(dtos, total, page, pageSize));
    }

    public async Task<Result<CompanyDto>> GetByIdAsync(long id, CancellationToken ct = default)
    {
        var company = await _repo.GetByIdAsync(id, ct);
        return company is null
            ? Result<CompanyDto>.NotFound($"Company {id} not found.")
            : Result<CompanyDto>.Success(MapToDto(company));
    }

    public async Task<Result<CompanyDto>> CreateAsync(CreateCompanyRequest request, CancellationToken ct = default)
    {
        var company = new Company
        {
            Name = request.Name,
            Description = request.Description,
            TaxNumber = request.TaxNumber,
            Website = request.Website,
            Email = request.Email,
            Phone = request.Phone
        };

        await _repo.AddAsync(company, ct);
        return Result<CompanyDto>.Created(MapToDto(company));
    }

    public async Task<Result<CompanyDto>> UpdateAsync(
        long id, UpdateCompanyRequest request, CancellationToken ct = default)
    {
        var company = await _repo.GetByIdAsync(id, ct);
        if (company is null) return Result<CompanyDto>.NotFound($"Company {id} not found.");

        company.Name = request.Name;
        company.Description = request.Description;
        company.TaxNumber = request.TaxNumber;
        company.Website = request.Website;
        company.Email = request.Email;
        company.Phone = request.Phone;
        company.IsActive = request.IsActive;
        company.UpdatedAt = DateTimeOffset.UtcNow;

        await _repo.UpdateAsync(company, ct);
        return Result<CompanyDto>.Success(MapToDto(company));
    }

    public async Task<Result<bool>> DeleteAsync(long id, CancellationToken ct = default)
    {
        var company = await _repo.GetByIdAsync(id, ct);
        if (company is null) return Result<bool>.NotFound($"Company {id} not found.");

        company.IsActive = false;
        company.UpdatedAt = DateTimeOffset.UtcNow;
        await _repo.UpdateAsync(company, ct);
        return Result<bool>.Success(true);
    }

    private static CompanyDto MapToDto(Company c) => new(
        c.Id, c.Name, c.Description, c.TaxNumber, c.Website, c.Email, c.Phone,
        c.IsActive, c.CreatedAt, c.UpdatedAt);
}
