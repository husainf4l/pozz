namespace PozzBackend.Modules.Investors.Application.DTOs;

/// <summary>
/// Detailed investor information including all CRM fields.
/// </summary>
public record InvestorDto(
    long Id,
    long UserId,
    string UserFullName,
    string UserEmail,
    long? CompanyId,
    string? CompanyName,
    string InvestorType,
    
    // Contact Information
    string? PrimaryEmail,
    string? SecondaryEmail,
    string? PrimaryPhone,
    string? SecondaryPhone,
    string? AddressLine1,
    string? AddressLine2,
    string? City,
    string? State,
    string? PostalCode,
    string? Country,
    
    // Professional Details
    string? Position,
    string? LinkedInUrl,
    string? TwitterHandle,
    string? Website,
    int? YearsOfExperience,
    
    // Investment Profile
    string? InvestmentRange,
    string[]? InvestmentFocus,
    string? PortfolioCompanies,
    string? NotableInvestments,
    string? PreviousExits,
    
    // Pipeline Tracking
    string PipelineStage,
    DateTimeOffset? LastContactDate,
    DateTimeOffset? NextFollowUpDate,
    string? Source,
    int Priority,
    
    // CRM Data
    string? Notes,
    string? Tags,
    decimal? PotentialInvestmentAmount,
    string? PreferredInvestmentInstrument,
    
    // Metadata
    bool IsActive,
    DateTimeOffset CreatedAt,
    DateTimeOffset UpdatedAt,
    long? CreatedBy,
    long? LastModifiedBy);

/// <summary>
/// Lightweight investor list item for displaying in tables/grids.
/// </summary>
public record InvestorListDto(
    long Id,
    string UserFullName,
    string UserEmail,
    string? PrimaryPhone,
    string? Position,
    string InvestorType,
    string PipelineStage,
    decimal? PotentialInvestmentAmount,
    DateTimeOffset? LastContactDate,
    DateTimeOffset? NextFollowUpDate,
    int Priority,
    bool IsActive);
