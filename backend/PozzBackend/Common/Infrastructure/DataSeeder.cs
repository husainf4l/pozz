using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PozzBackend.Common.Infrastructure.Authorization;
using PozzBackend.Modules.Auth.Domain;

namespace PozzBackend.Common.Infrastructure;

/// <summary>
/// Seeds default roles, permissions, and an admin user on first run.
/// </summary>
public class DataSeeder
{
    private readonly ApplicationDbContext _db;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<ApplicationRole> _roleManager;

    public DataSeeder(
        ApplicationDbContext db,
        UserManager<ApplicationUser> userManager,
        RoleManager<ApplicationRole> roleManager)
    {
        _db = db;
        _userManager = userManager;
        _roleManager = roleManager;
    }

    public async Task SeedAsync()
    {
        await SeedPermissionsAsync();
        await SeedRolesAsync();
        await SeedAdminUserAsync();
    }

    // ── Permissions ───────────────────────────────────────────────────────
    private async Task SeedPermissionsAsync()
    {
        var all = PermissionConstants.GetAll().ToList();
        foreach (var (name, module, description) in all)
        {
            if (!await _db.Permissions.AnyAsync(p => p.Name == name))
            {
                _db.Permissions.Add(new Permission
                {
                    Name = name,
                    Module = module,
                    Description = description
                });
            }
        }
        await _db.SaveChangesAsync();
    }

    // ── Roles ─────────────────────────────────────────────────────────────
    private async Task SeedRolesAsync()
    {
        // Admin — all permissions
        await EnsureRoleAsync("Admin", "Full system access",
            PermissionConstants.GetAll().Select(p => p.Name));

        // Manager — read + create + update (no delete, no manage)
        await EnsureRoleAsync("Manager", "Operational access",
        [
            PermissionConstants.Users.Read,    PermissionConstants.Users.Create,    PermissionConstants.Users.Update,
            PermissionConstants.Roles.Read,
            PermissionConstants.Companies.Read, PermissionConstants.Companies.Create, PermissionConstants.Companies.Update,
            PermissionConstants.Investors.Read, PermissionConstants.Investors.Create, PermissionConstants.Investors.Update,
            PermissionConstants.Projects.Read, PermissionConstants.Projects.Create, PermissionConstants.Projects.Update,
        ]);

        // User — read-only
        await EnsureRoleAsync("User", "Read-only access",
        [
            PermissionConstants.Users.Read,
            PermissionConstants.Companies.Read,
            PermissionConstants.Investors.Read,
            PermissionConstants.Projects.Read, PermissionConstants.Projects.Create, PermissionConstants.Projects.Update,
        ]);

        // Investor — can view companies/investors + manage their onboarding
        await EnsureRoleAsync("Investor", "Investor access",
        [
            PermissionConstants.Companies.Read,
            PermissionConstants.Investors.Read,
            PermissionConstants.Onboarding.Read,
            PermissionConstants.Onboarding.Update,
        ]);

        // ProjectOwner — can manage their own company + onboarding + projects
        await EnsureRoleAsync("ProjectOwner", "Project owner access",
        [
            PermissionConstants.Companies.Read,
            PermissionConstants.Companies.Create,
            PermissionConstants.Companies.Update,
            PermissionConstants.Investors.Read,
            PermissionConstants.Onboarding.Read,
            PermissionConstants.Onboarding.Update,
            PermissionConstants.Projects.Read,
            PermissionConstants.Projects.Create,
            PermissionConstants.Projects.Update,
            PermissionConstants.Projects.Delete,
        ]);
    }

    private async Task EnsureRoleAsync(string roleName, string description, IEnumerable<string> permissionNames)
    {
        if (!await _roleManager.RoleExistsAsync(roleName))
        {
            var role = new ApplicationRole(roleName) { Description = description };
            await _roleManager.CreateAsync(role);
        }

        var dbRole = await _db.Roles
            .Include(r => r.RolePermissions)
            .FirstAsync(r => r.Name == roleName);

        var permissions = await _db.Permissions
            .Where(p => permissionNames.Contains(p.Name))
            .ToListAsync();

        foreach (var perm in permissions)
        {
            if (!dbRole.RolePermissions.Any(rp => rp.PermissionId == perm.Id))
            {
                _db.RolePermissions.Add(new RolePermission
                {
                    RoleId = dbRole.Id,
                    PermissionId = perm.Id
                });
            }
        }
        await _db.SaveChangesAsync();
    }

    // ── Admin user ────────────────────────────────────────────────────────
    private async Task SeedAdminUserAsync()
    {
        const string adminEmail = "admin@pozz.com";
        const string adminPassword = "Admin123!";

        if (await _userManager.FindByEmailAsync(adminEmail) is not null)
            return;

        var admin = new ApplicationUser
        {
            UserName = adminEmail,
            Email = adminEmail,
            FirstName = "System",
            LastName = "Admin",
            EmailConfirmed = true,
            IsActive = true
        };

        var result = await _userManager.CreateAsync(admin, adminPassword);
        if (result.Succeeded)
            await _userManager.AddToRoleAsync(admin, "Admin");
    }
}
