namespace PozzBackend.Modules.Projects.Domain;

public enum ProjectStatus
{
    Draft = 0,      // Project created but not published
    Active = 1,     // Published and accepting investments
    Funded = 2,     // Funding goal reached
    Closed = 3,     // Project closed/completed
    Cancelled = 4   // Project cancelled
}
