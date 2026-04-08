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

    public async Task<Result<PagedResult<InvestorListDto>>> SearchAsync(
        InvestorSearchRequest request, CancellationToken ct = default)
    {
        var (items, total) = await _repo.SearchAsync(request, ct);
        var dtos = items.Select(MapToListDto);
        return Result<PagedResult<InvestorListDto>>.Success(
            new PagedResult<InvestorListDto>(dtos, total, request.Page, request.PageSize));
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
            
            // Contact Information
            PrimaryEmail = request.PrimaryEmail,
            SecondaryEmail = request.SecondaryEmail,
            PrimaryPhone = request.PrimaryPhone,
            SecondaryPhone = request.SecondaryPhone,
            AddressLine1 = request.AddressLine1,
            AddressLine2 = request.AddressLine2,
            City = request.City,
            State = request.State,
            PostalCode = request.PostalCode,
            Country = request.Country,
            
            // Professional Details
            Position = request.Position,
            LinkedInUrl = request.LinkedInUrl,
            TwitterHandle = request.TwitterHandle,
            Website = request.Website,
            YearsOfExperience = request.YearsOfExperience,
            
            // Investment Profile
            InvestmentRange = request.InvestmentRange,
            InvestmentFocus = request.InvestmentFocus,
            PortfolioCompanies = request.PortfolioCompanies,
            NotableInvestments = request.NotableInvestments,
            PreviousExits = request.PreviousExits,
            
            // Pipeline Tracking
            PipelineStage = request.PipelineStage,
            LastContactDate = request.LastContactDate,
            NextFollowUpDate = request.NextFollowUpDate,
            Source = request.Source,
            Priority = request.Priority,
            
            // CRM Data
            Notes = request.Notes,
            Tags = request.Tags,
            PotentialInvestmentAmount = request.PotentialInvestmentAmount,
            PreferredInvestmentInstrument = request.PreferredInvestmentInstrument
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

        // Update only non-null fields
        if (request.CompanyId.HasValue) investor.CompanyId = request.CompanyId.Value;
        if (request.InvestorType.HasValue) investor.InvestorType = request.InvestorType.Value;
        
        // Contact Information
        if (request.PrimaryEmail != null) investor.PrimaryEmail = request.PrimaryEmail;
        if (request.SecondaryEmail != null) investor.SecondaryEmail = request.SecondaryEmail;
        if (request.PrimaryPhone != null) investor.PrimaryPhone = request.PrimaryPhone;
        if (request.SecondaryPhone != null) investor.SecondaryPhone = request.SecondaryPhone;
        if (request.AddressLine1 != null) investor.AddressLine1 = request.AddressLine1;
        if (request.AddressLine2 != null) investor.AddressLine2 = request.AddressLine2;
        if (request.City != null) investor.City = request.City;
        if (request.State != null) investor.State = request.State;
        if (request.PostalCode != null) investor.PostalCode = request.PostalCode;
        if (request.Country != null) investor.Country = request.Country;
        
        // Professional Details
        if (request.Position != null) investor.Position = request.Position;
        if (request.LinkedInUrl != null) investor.LinkedInUrl = request.LinkedInUrl;
        if (request.TwitterHandle != null) investor.TwitterHandle = request.TwitterHandle;
        if (request.Website != null) investor.Website = request.Website;
        if (request.YearsOfExperience.HasValue) investor.YearsOfExperience = request.YearsOfExperience;
        
        // Investment Profile
        if (request.InvestmentRange != null) investor.InvestmentRange = request.InvestmentRange;
        if (request.InvestmentFocus != null) investor.InvestmentFocus = request.InvestmentFocus;
        if (request.PortfolioCompanies != null) investor.PortfolioCompanies = request.PortfolioCompanies;
        if (request.NotableInvestments != null) investor.NotableInvestments = request.NotableInvestments;
        if (request.PreviousExits != null) investor.PreviousExits = request.PreviousExits;
        
        // Pipeline Tracking
        if (request.PipelineStage.HasValue) investor.PipelineStage = request.PipelineStage.Value;
        if (request.LastContactDate.HasValue) investor.LastContactDate = request.LastContactDate;
        if (request.NextFollowUpDate.HasValue) investor.NextFollowUpDate = request.NextFollowUpDate;
        if (request.Source != null) investor.Source = request.Source;
        if (request.Priority.HasValue) investor.Priority = request.Priority.Value;
        
        // CRM Data
        if (request.Notes != null) investor.Notes = request.Notes;
        if (request.Tags != null) investor.Tags = request.Tags;
        if (request.PotentialInvestmentAmount.HasValue) investor.PotentialInvestmentAmount = request.PotentialInvestmentAmount;
        if (request.PreferredInvestmentInstrument != null) investor.PreferredInvestmentInstrument = request.PreferredInvestmentInstrument;
        
        if (request.IsActive.HasValue) investor.IsActive = request.IsActive.Value;
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
        
        // Contact Information
        i.PrimaryEmail,
        i.SecondaryEmail,
        i.PrimaryPhone,
        i.SecondaryPhone,
        i.AddressLine1,
        i.AddressLine2,
        i.City,
        i.State,
        i.PostalCode,
        i.Country,
        
        // Professional Details
        i.Position,
        i.LinkedInUrl,
        i.TwitterHandle,
        i.Website,
        i.YearsOfExperience,
        
        // Investment Profile
        i.InvestmentRange,
        i.InvestmentFocus,
        i.PortfolioCompanies,
        i.NotableInvestments,
        i.PreviousExits,
        
        // Pipeline Tracking
        i.PipelineStage.ToString(),
        i.LastContactDate,
        i.NextFollowUpDate,
        i.Source,
        i.Priority,
        
        // CRM Data
        i.Notes,
        i.Tags,
        i.PotentialInvestmentAmount,
        i.PreferredInvestmentInstrument,
        
        // Metadata
        i.IsActive,
        i.CreatedAt,
        i.UpdatedAt,
        i.CreatedBy,
        i.LastModifiedBy);

    private static InvestorListDto MapToListDto(Investor i) => new(
        i.Id,
        i.User?.FullName ?? string.Empty,
        i.User?.Email ?? string.Empty,
        i.PrimaryPhone,
        i.Position,
        i.InvestorType.ToString(),
        i.PipelineStage.ToString(),
        i.PotentialInvestmentAmount,
        i.LastContactDate,
        i.NextFollowUpDate,
        i.Priority,
        i.IsActive);
}
