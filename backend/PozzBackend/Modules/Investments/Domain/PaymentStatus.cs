namespace PozzBackend.Modules.Investments.Domain;

/// <summary>
/// Payment status for an investment.
/// </summary>
public enum PaymentStatus
{
    Pending = 1,      // Commitment made but no payment yet
    Partial = 2,      // Partial payment received
    Paid = 3,         // Fully paid
    Overdue = 4,      // Payment overdue
    Cancelled = 5     // Investment cancelled
}
