using System.ComponentModel.DataAnnotations;

namespace PozzBackend.Modules.Onboarding.Application.DTOs;

/// <summary>
/// Submitted for the "company_setup" step (ProjectOwner role only).
/// Creates the owner's company and links it to the user.
/// </summary>
public record CompanySetupRequest(
    [Required] string CompanyName,
    string?           RegistrationNumber,
    string?           Industry,
    string?           TaxNumber,
    [Url] string?     Website,
    [EmailAddress] string? Email,
    string?           Phone,
    string?           Description);

/// <summary>
/// Submitted for the "company_details" step.
/// Enriches an already-created company with additional details.
/// </summary>
public record CompanyDetailsRequest(
    string? Description,
    string? Industry,
    [Url] string?  Website,
    [EmailAddress] string? Email,
    string?        Phone,
    string?        TaxNumber);
