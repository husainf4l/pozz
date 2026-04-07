namespace PozzBackend.Common.Infrastructure.Authorization;

public static class PermissionConstants
{
    public static class Users
    {
        public const string Read           = "users.read";
        public const string Create         = "users.create";
        public const string Update         = "users.update";
        public const string Delete         = "users.delete";
        public const string ManageRoles    = "users.manage_roles";
    }

    public static class Roles
    {
        public const string Read               = "roles.read";
        public const string Create             = "roles.create";
        public const string Update             = "roles.update";
        public const string Delete             = "roles.delete";
        public const string ManagePermissions  = "roles.manage_permissions";
    }

    public static class Companies
    {
        public const string Read    = "companies.read";
        public const string Create  = "companies.create";
        public const string Update  = "companies.update";
        public const string Delete  = "companies.delete";
    }

    public static class Investors
    {
        public const string Read    = "investors.read";
        public const string Create  = "investors.create";
        public const string Update  = "investors.update";
        public const string Delete  = "investors.delete";
    }

    public static class Onboarding
    {
        public const string Read   = "onboarding.read";
        public const string Update = "onboarding.update";
    }

    public static class Projects
    {
        public const string Read    = "projects.read";
        public const string Create  = "projects.create";
        public const string Update  = "projects.update";
        public const string Delete  = "projects.delete";
    }

    /// <summary>Returns all permission (Name, Module) pairs for seeding.</summary>
    public static IEnumerable<(string Name, string Module, string Description)> GetAll() =>
    [
        (Users.Read,               "Users",     "View users"),
        (Users.Create,             "Users",     "Create users"),
        (Users.Update,             "Users",     "Update users"),
        (Users.Delete,             "Users",     "Delete users"),
        (Users.ManageRoles,        "Users",     "Assign / remove user roles"),

        (Roles.Read,               "Roles",     "View roles"),
        (Roles.Create,             "Roles",     "Create roles"),
        (Roles.Update,             "Roles",     "Update roles"),
        (Roles.Delete,             "Roles",     "Delete roles"),
        (Roles.ManagePermissions,  "Roles",     "Assign / remove role permissions"),

        (Companies.Read,           "Companies", "View companies"),
        (Companies.Create,         "Companies", "Create companies"),
        (Companies.Update,         "Companies", "Update companies"),
        (Companies.Delete,         "Companies", "Delete companies"),

        (Investors.Read,           "Investors",   "View investors"),
        (Investors.Create,         "Investors",   "Create investors"),
        (Investors.Update,         "Investors",   "Update investors"),
        (Investors.Delete,         "Investors",   "Delete investors"),

        (Onboarding.Read,          "Onboarding",  "View own onboarding status"),
        (Onboarding.Update,        "Onboarding",  "Complete onboarding steps"),

        (Projects.Read,            "Projects",    "View own projects"),
        (Projects.Create,          "Projects",    "Create projects"),
        (Projects.Update,          "Projects",    "Update projects"),
        (Projects.Delete,          "Projects",    "Delete projects"),
    ];
}
