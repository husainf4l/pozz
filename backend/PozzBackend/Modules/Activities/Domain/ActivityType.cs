namespace PozzBackend.Modules.Activities.Domain;

public enum ActivityType
{
    Note = 1,
    Email = 2,
    PhoneCall = 3,
    Meeting = 4,
    InvestmentUpdated = 5,
    InvestorUpdated = 6,
    DocumentUploaded = 7,
    StatusChanged = 8,
    PaymentReceived = 9,
    FollowUpScheduled = 10,
    Other = 99
}
