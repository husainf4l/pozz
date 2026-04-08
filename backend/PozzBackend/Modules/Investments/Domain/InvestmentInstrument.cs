namespace PozzBackend.Modules.Investments.Domain;

/// <summary>
/// Types of investment instruments.
/// </summary>
public enum InvestmentInstrument
{
    Equity = 1,              // Direct equity purchase
    SAFE = 2,                // Simple Agreement for Future Equity
    ConvertibleNote = 3,     // Convertible debt
    RevenueShare = 4,        // Revenue-based financing
    Debt = 5,                // Traditional loan/debt
    Warrant = 6,             // Equity warrant
    PreferredStock = 7,      // Preferred shares
    CommonStock = 8          // Common shares
}
