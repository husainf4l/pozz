using System.ComponentModel.DataAnnotations;
using PozzBackend.Modules.Investors.Domain;

namespace PozzBackend.Modules.Investors.Application.DTOs;

public record CreateInvestorRequest(
    [Required] long UserId,
    long? CompanyId,
    [Required] InvestorType InvestorType,
    
    // Contact Information
    [EmailAddress] string? PrimaryEmail,
    [EmailAddress] string? SecondaryEmail,
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
    [Url] string? LinkedInUrl,
    string? TwitterHandle,
    [Url] string? Website,
    int? YearsOfExperience,
    
    // Investment Profile
    string? InvestmentRange,
    string[]? InvestmentFocus,
    string? PortfolioCompanies,
    string? NotableInvestments,
    string? PreviousExits,
    
    // Pipeline Tracking
    PipelineStage PipelineStage = PipelineStage.Target,
    DateTimeOffset? LastContactDate = null,
    DateTimeOffset? NextFollowUpDate = null,
    string? Source = null,
    int Priority = 3,
    
    // CRM Data
    string? Notes = null,
    string? Tags = null,
    decimal? PotentialInvestmentAmount = null,
    string? PreferredInvestmentInstrument = null);

public record UpdateInvestorRequest(
    long? CompanyId,
    InvestorType? InvestorType,
    
    // Contact Information
    [EmailAddress] string? PrimaryEmail,
    [EmailAddress] string? SecondaryEmail,
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
    [Url] string? LinkedInUrl,
    string? TwitterHandle,
    [Url] string? Website,
    int? YearsOfExperience,
    
    // Investment Profile
    string? InvestmentRange,
    string[]? InvestmentFocus,
    string? PortfolioCompanies,
    string? NotableInvestments,
    string? PreviousExits,
    
    // Pipeline Tracking
    PipelineStage? PipelineStage,
    DateTimeOffset? LastContactDate,
    DateTimeOffset? NextFollowUpDate,
    string? Source,
    int? Priority,
    
    // CRM Data
    string? Notes,
    string? Tags,
    decimal? PotentialInvestmentAmount,
    string? PreferredInvestmentInstrument,
    
    bool? IsActive);

/// <summary>
/// Query parameters for searching/filtering investors.
/// </summary>
public record InvestorSearchRequest(
    int Page = 1,
    int PageSize = 20,
    long? CompanyId = null,
    string? SearchTerm = null,          // Search in name, email, phone
    PipelineStage? PipelineStage = null,
    InvestorType? InvestorType = null,
    int? Priority = null,
    bool? IsActive = null,
    string? SortBy = "LastContactDate",  // LastContactDate, Name, CreatedAt, Priority
    string? SortDirection = "desc");     // asc, desc
