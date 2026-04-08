namespace PozzBackend.Modules.Investors.Domain;

/// <summary>
/// Represents the fundraising pipeline stage for an investor contact.
/// </summary>
public enum PipelineStage
{
    Target = 1,           // Identified but not yet contacted
    Contacted = 2,        // Initial outreach made
    Pitched = 3,          // Pitch deck sent / presented
    DueDiligence = 4,     // Investor conducting due diligence
    TermSheet = 5,        // Term sheet stage / negotiating terms
    Committed = 6,        // Investor has committed to invest
    Invested = 7,         // Investment received and processed
    Passed = 8,           // Investor passed / declined
    Inactive = 9          // No longer actively pursuing
}
