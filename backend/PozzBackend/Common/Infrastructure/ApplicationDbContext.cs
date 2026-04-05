using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using PozzBackend.Modules.Auth.Domain;
using PozzBackend.Modules.Companies.Domain;
using PozzBackend.Modules.Investors.Domain;
using PozzBackend.Modules.Onboarding.Domain;

namespace PozzBackend.Common.Infrastructure;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, long,
    IdentityUserClaim<long>, IdentityUserRole<long>, IdentityUserLogin<long>,
    IdentityRoleClaim<long>, IdentityUserToken<long>>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<Permission>       Permissions       => Set<Permission>();
    public DbSet<RolePermission>   RolePermissions   => Set<RolePermission>();
    public DbSet<RefreshToken>     RefreshTokens     => Set<RefreshToken>();
    public DbSet<Company>          Companies         => Set<Company>();
    public DbSet<Investor>         Investors         => Set<Investor>();
    public DbSet<UserOnboarding>   UserOnboardings   => Set<UserOnboarding>();
    public DbSet<InvestorProfile>  InvestorProfiles  => Set<InvestorProfile>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // ── Identity table names (snake_case) ──────────────────────────────
        builder.Entity<ApplicationUser>().ToTable("users");
        builder.Entity<ApplicationRole>().ToTable("roles");
        builder.Entity<IdentityUserRole<long>>().ToTable("user_roles");
        builder.Entity<IdentityUserClaim<long>>().ToTable("user_claims");
        builder.Entity<IdentityUserLogin<long>>().ToTable("user_logins");
        builder.Entity<IdentityRoleClaim<long>>().ToTable("role_claims");
        builder.Entity<IdentityUserToken<long>>().ToTable("user_tokens");

        // ── ApplicationUser ────────────────────────────────────────────────
        builder.Entity<ApplicationUser>(e =>
        {
            e.Property(u => u.FirstName).IsRequired().HasMaxLength(100);
            e.Property(u => u.LastName).IsRequired().HasMaxLength(100);
            e.Property(u => u.IsActive).IsRequired().HasDefaultValue(true);
            e.Property(u => u.Nationality).HasMaxLength(100);
            e.Property(u => u.Country).HasMaxLength(100);
            e.Property(u => u.CreatedAt).IsRequired();
            e.Property(u => u.UpdatedAt).IsRequired();
        });

        // ── ApplicationRole ────────────────────────────────────────────────
        builder.Entity<ApplicationRole>(e =>
        {
            e.Property(r => r.Description).HasMaxLength(300);
        });

        // ── Permission ─────────────────────────────────────────────────────
        builder.Entity<Permission>(e =>
        {
            e.ToTable("permissions");
            e.HasKey(p => p.Id);
            e.Property(p => p.Name).IsRequired().HasMaxLength(100);
            e.Property(p => p.Module).IsRequired().HasMaxLength(50);
            e.HasIndex(p => p.Name).IsUnique();
        });

        // ── RolePermission (join) ──────────────────────────────────────────
        builder.Entity<RolePermission>(e =>
        {
            e.ToTable("role_permissions");
            e.HasKey(rp => new { rp.RoleId, rp.PermissionId });
            e.HasOne(rp => rp.Role)
             .WithMany(r => r.RolePermissions)
             .HasForeignKey(rp => rp.RoleId)
             .OnDelete(DeleteBehavior.Cascade);
            e.HasOne(rp => rp.Permission)
             .WithMany(p => p.RolePermissions)
             .HasForeignKey(rp => rp.PermissionId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        // ── RefreshToken ───────────────────────────────────────────────────
        builder.Entity<RefreshToken>(e =>
        {
            e.ToTable("refresh_tokens");
            e.HasKey(rt => rt.Id);
            e.Property(rt => rt.Token).IsRequired().HasMaxLength(500);
            e.HasIndex(rt => rt.Token).IsUnique();
            e.HasOne(rt => rt.User)
             .WithMany()
             .HasForeignKey(rt => rt.UserId)
             .OnDelete(DeleteBehavior.Cascade);
            e.HasIndex(rt => rt.UserId);
        });

        // ── Company ────────────────────────────────────────────────────────
        builder.Entity<Company>(e =>
        {
            e.ToTable("companies");
            e.HasKey(c => c.Id);
            e.Property(c => c.Name).IsRequired().HasMaxLength(200);
            e.Property(c => c.RegistrationNumber).HasMaxLength(100);
            e.Property(c => c.Industry).HasMaxLength(100);
            e.Property(c => c.TaxNumber).HasMaxLength(50);
            e.Property(c => c.Website).HasMaxLength(300);
            e.Property(c => c.Email).HasMaxLength(200);
            e.Property(c => c.Phone).HasMaxLength(50);
            e.Property(c => c.IsActive).IsRequired().HasDefaultValue(true);
            e.HasIndex(c => c.Name);
            e.HasIndex(c => c.OwnerId);
            e.HasOne(c => c.Owner)
             .WithMany()
             .HasForeignKey(c => c.OwnerId)
             .OnDelete(DeleteBehavior.SetNull)
             .IsRequired(false);
        });

        // ── Investor ───────────────────────────────────────────────────────
        builder.Entity<Investor>(e =>
        {
            e.ToTable("investors");
            e.HasKey(i => i.Id);
            e.Property(i => i.InvestorType).IsRequired()
             .HasConversion<string>()
             .HasMaxLength(20);
            e.Property(i => i.IsActive).IsRequired().HasDefaultValue(true);
            e.HasOne(i => i.User)
             .WithMany()
             .HasForeignKey(i => i.UserId)
             .OnDelete(DeleteBehavior.Restrict);
            e.HasOne(i => i.Company)
             .WithMany(c => c.Investors)
             .HasForeignKey(i => i.CompanyId)
             .OnDelete(DeleteBehavior.SetNull)
             .IsRequired(false);
            e.HasIndex(i => i.UserId);
            e.HasIndex(i => i.CompanyId);
        });

        // ── UserOnboarding ────────────────────────────────────────────────
        builder.Entity<UserOnboarding>(e =>
        {
            e.ToTable("user_onboardings");
            e.HasKey(o => o.Id);
            e.Property(o => o.OnboardingRole).IsRequired()
             .HasConversion<string>()
             .HasMaxLength(20);
            e.Property(o => o.Status).IsRequired()
             .HasConversion<string>()
             .HasMaxLength(20);
            e.Property(o => o.CompletedSteps).IsRequired();          // TEXT[] native Npgsql array
            e.HasOne(o => o.User)
             .WithMany()
             .HasForeignKey(o => o.UserId)
             .OnDelete(DeleteBehavior.Cascade);
            e.HasIndex(o => o.UserId).IsUnique();                   // one onboarding per user
        });

        // ── InvestorProfile ───────────────────────────────────────────────
        builder.Entity<InvestorProfile>(e =>
        {
            e.ToTable("investor_profiles");
            e.HasKey(p => p.Id);
            e.Property(p => p.InvestorType).IsRequired().HasMaxLength(20);
            e.Property(p => p.InvestmentBudgetRange).HasMaxLength(50);
            e.Property(p => p.InvestmentInterests).IsRequired();    // TEXT[] native Npgsql array
            e.Property(p => p.LinkedInProfile).HasMaxLength(300);
            e.HasOne(p => p.User)
             .WithMany()
             .HasForeignKey(p => p.UserId)
             .OnDelete(DeleteBehavior.Cascade);
            e.HasIndex(p => p.UserId).IsUnique();                   // one profile per user
        });
    }
}
