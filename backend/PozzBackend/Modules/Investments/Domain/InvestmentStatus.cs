namespace PozzBackend.Modules.Investments.Domain;

/// <summary>
/// Overall status of the investment.
/// </summary>
public enum InvestmentStatus
{
    Active = 1,       // Current active investment
    Exited = 2,       // Investor has exited (sold shares/converted)
    WrittenOff = 3,   // Investment written off
    Cancelled = 4     // Investment cancelled before closing
}
