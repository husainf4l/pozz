using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using PozzBackend.Modules.Activities.Domain;
using PozzBackend.Modules.Auth.Domain;
using PozzBackend.Modules.Companies.Domain;
using PozzBackend.Modules.Investors.Domain;
using PozzBackend.Modules.Investments.Domain;
using PozzBackend.Modules.Onboarding.Domain;
using PozzBackend.Modules.Projects.Domain;

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
    public DbSet<Investment>       Investments       => Set<Investment>();
    public DbSet<Activity>         Activities        => Set<Activity>();
    public DbSet<UserOnboarding>   UserOnboardings   => Set<UserOnboarding>();
    public DbSet<InvestorProfile>  InvestorProfiles  => Set<InvestorProfile>();
    public DbSet<Project>          Projects          => Set<Project>();

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
            
            // ── Basic Info ──────────────────────────────────────────────────
            e.Property(i => i.InvestorType).IsRequired()
             .HasConversion<string>()
             .HasMaxLength(20);
            e.Property(i => i.IsActive).IsRequired().HasDefaultValue(true);
            
            // ── Contact Information ─────────────────────────────────────────
            e.Property(i => i.PrimaryEmail).HasMaxLength(200);
            e.Property(i => i.SecondaryEmail).HasMaxLength(200);
            e.Property(i => i.PrimaryPhone).HasMaxLength(50);
            e.Property(i => i.SecondaryPhone).HasMaxLength(50);
            e.Property(i => i.AddressLine1).HasMaxLength(300);
            e.Property(i => i.AddressLine2).HasMaxLength(300);
            e.Property(i => i.City).HasMaxLength(100);
            e.Property(i => i.State).HasMaxLength(100);
            e.Property(i => i.PostalCode).HasMaxLength(20);
            e.Property(i => i.Country).HasMaxLength(100);
            
            // ── Professional Details ────────────────────────────────────────
            e.Property(i => i.Position).HasMaxLength(150);
            e.Property(i => i.LinkedInUrl).HasMaxLength(300);
            e.Property(i => i.TwitterHandle).HasMaxLength(100);
            e.Property(i => i.Website).HasMaxLength(300);
            
            // ── Investment Profile ──────────────────────────────────────────
            e.Property(i => i.InvestmentRange).HasMaxLength(100);
            e.Property(i => i.InvestmentFocus);  // TEXT[] native Npgsql array
            e.Property(i => i.PortfolioCompanies).HasMaxLength(2000);
            e.Property(i => i.NotableInvestments).HasMaxLength(2000);
            e.Property(i => i.PreviousExits).HasMaxLength(1000);
            
            // ── Pipeline Tracking ───────────────────────────────────────────
            e.Property(i => i.PipelineStage).IsRequired()
             .HasConversion<string>()
             .HasMaxLength(20);
            e.Property(i => i.Source).HasMaxLength(200);
            e.Property(i => i.Priority).IsRequired().HasDefaultValue(3);
            
            // ── CRM Data ────────────────────────────────────────────────────
            e.Property(i => i.Tags).HasMaxLength(500);
            e.Property(i => i.PotentialInvestmentAmount).HasPrecision(18, 2);
            e.Property(i => i.PreferredInvestmentInstrument).HasMaxLength(50);
            
            // ── Timestamps ──────────────────────────────────────────────────
            e.Property(i => i.CreatedAt).IsRequired();
            e.Property(i => i.UpdatedAt).IsRequired();
            
            // ── Relationships ───────────────────────────────────────────────
            e.HasOne(i => i.User)
             .WithMany()
             .HasForeignKey(i => i.UserId)
             .OnDelete(DeleteBehavior.Restrict);
            e.HasOne(i => i.Company)
             .WithMany(c => c.Investors)
             .HasForeignKey(i => i.CompanyId)
             .OnDelete(DeleteBehavior.SetNull)
             .IsRequired(false);
            
            // ── Indexes ─────────────────────────────────────────────────────
            e.HasIndex(i => i.UserId);
            e.HasIndex(i => i.CompanyId);
            e.HasIndex(i => i.PipelineStage);
            e.HasIndex(i => i.PrimaryEmail);
            e.HasIndex(i => i.LastContactDate);
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

        // ── Project ───────────────────────────────────────────────────────
        builder.Entity<Project>(e =>
        {
            e.ToTable("projects");
            e.HasKey(p => p.Id);
            e.Property(p => p.Title).IsRequired().HasMaxLength(200);
            e.Property(p => p.Description).HasMaxLength(5000);
            e.Property(p => p.Summary).HasMaxLength(500);
            e.Property(p => p.Industry).HasMaxLength(100);
            e.Property(p => p.Location).HasMaxLength(200);
            e.Property(p => p.FundingGoal).IsRequired().HasPrecision(18, 2);
            e.Property(p => p.MinimumInvestment).IsRequired().HasPrecision(18, 2);
            e.Property(p => p.CurrentFunding).IsRequired().HasPrecision(18, 2).HasDefaultValue(0);
            e.Property(p => p.Status).IsRequired().HasConversion<int>();
            e.Property(p => p.ExpectedReturn).HasPrecision(10, 2);
            e.Property(p => p.ImageUrl);
            e.Property(p => p.Documents).HasMaxLength(2000);
            e.Property(p => p.ViewCount).IsRequired().HasDefaultValue(0);
            e.Property(p => p.IsActive).IsRequired().HasDefaultValue(true);
            e.Property(p => p.CreatedAt).IsRequired();
            e.Property(p => p.UpdatedAt).IsRequired();
            e.HasOne(p => p.Company)
             .WithMany()
             .HasForeignKey(p => p.CompanyId)
             .OnDelete(DeleteBehavior.Cascade);
            e.HasIndex(p => p.CompanyId);
            e.HasIndex(p => p.Status);
        });

        // ── Investment ────────────────────────────────────────────────────
        builder.Entity<Investment>(e =>
        {
            e.ToTable("investments");
            e.HasKey(i => i.Id);
            
            // ── Core Investment Info ─────────────────────────────────────────
            e.Property(i => i.CommittedAmount).IsRequired().HasPrecision(18, 2);
            e.Property(i => i.PaidAmount).IsRequired().HasPrecision(18, 2).HasDefaultValue(0);
            e.Property(i => i.EquityPercentage).IsRequired().HasPrecision(10, 4);
            e.Property(i => i.Instrument).IsRequired()
             .HasConversion<string>()
             .HasMaxLength(30);
            e.Property(i => i.PaymentStatus).IsRequired()
             .HasConversion<string>()
             .HasMaxLength(20);
            
            // ── SAFE / Convertible Note Specific ─────────────────────────────
            e.Property(i => i.ValuationCap).HasPrecision(18, 2);
            e.Property(i => i.DiscountRate).HasPrecision(5, 2);
            e.Property(i => i.InterestRate).HasPrecision(5, 2);
            
            // ── Legal & Documentation ────────────────────────────────────────
            e.Property(i => i.TermSheetUrl).HasMaxLength(500);
            e.Property(i => i.AgreementUrl).HasMaxLength(500);
            e.Property(i => i.ShareCertificateUrl).HasMaxLength(500);
            e.Property(i => i.InternalReference).HasMaxLength(100);
            e.Property(i => i.AntiDilutionType).HasMaxLength(100);
            
            // ── Status ────────────────────────────────────────────────────────
            e.Property(i => i.Status).IsRequired()
             .HasConversion<string>()
             .HasMaxLength(20);
            
            // ── Timestamps ────────────────────────────────────────────────────
            e.Property(i => i.CreatedAt).IsRequired();
            e.Property(i => i.UpdatedAt).IsRequired();
            
            // ── Relationships ─────────────────────────────────────────────────
            e.HasOne(i => i.Investor)
             .WithMany()
             .HasForeignKey(i => i.InvestorId)
             .OnDelete(DeleteBehavior.Restrict);
            e.HasOne(i => i.Project)
             .WithMany()
             .HasForeignKey(i => i.ProjectId)
             .OnDelete(DeleteBehavior.SetNull)
             .IsRequired(false);
            
            // ── Indexes ───────────────────────────────────────────────────────
            e.HasIndex(i => i.InvestorId);
            e.HasIndex(i => i.ProjectId);
            e.HasIndex(i => i.CompanyId);
            e.HasIndex(i => i.PaymentStatus);
            e.HasIndex(i => i.Status);
            e.HasIndex(i => i.CommitmentDate);
        });

        // ── Activity ──────────────────────────────────────────────────────
        builder.Entity<Activity>(e =>
        {
            e.ToTable("activities");
            e.HasKey(a => a.Id);
            
            // ── Core Activity Info ────────────────────────────────────────────
            e.Property(a => a.Type).IsRequired()
             .HasConversion<int>();
            e.Property(a => a.Title).IsRequired().HasMaxLength(300);
            e.Property(a => a.Description).HasMaxLength(5000);
            e.Property(a => a.ActivityDate).IsRequired();
            e.Property(a => a.Outcome).HasMaxLength(2000);
            e.Property(a => a.NextSteps).HasMaxLength(1000);
            e.Property(a => a.FollowUpDate);
            e.Property(a => a.IsPrivate).IsRequired().HasDefaultValue(false);
            
            // ── Email Specific Fields ──────────────────────────────────────────
            e.Property(a => a.EmailSubject).HasMaxLength(500);
            e.Property(a => a.EmailRecipients).HasMaxLength(2000);
            
            // ── Call Specific Fields ───────────────────────────────────────────
            e.Property(a => a.CallDurationMinutes);
            
            // ── Meeting Specific Fields ────────────────────────────────────────
            e.Property(a => a.MeetingLocation).HasMaxLength(300);
            e.Property(a => a.MeetingAttendees).HasMaxLength(2000);
            
            // ── Document Fields ────────────────────────────────────────────────
            e.Property(a => a.DocumentUrl).HasMaxLength(500);
            e.Property(a => a.DocumentName).HasMaxLength(300);
            
            // ── Timestamps & Audit ─────────────────────────────────────────────
            e.Property(a => a.CreatedAt).IsRequired();
            e.Property(a => a.UpdatedAt).IsRequired();
            e.Property(a => a.CreatedBy).IsRequired();
            e.Property(a => a.LastModifiedBy);
            
            // ── Relationships ──────────────────────────────────────────────────
            e.HasOne<Investor>()
             .WithMany()
             .HasForeignKey(a => a.InvestorId)
             .OnDelete(DeleteBehavior.SetNull)
             .IsRequired(false);
            e.HasOne<Investment>()
             .WithMany()
             .HasForeignKey(a => a.InvestmentId)
             .OnDelete(DeleteBehavior.SetNull)
             .IsRequired(false);
            e.HasOne<Project>()
             .WithMany()
             .HasForeignKey(a => a.ProjectId)
             .OnDelete(DeleteBehavior.SetNull)
             .IsRequired(false);
            
            // ── Indexes ────────────────────────────────────────────────────────
            e.HasIndex(a => a.CompanyId);
            e.HasIndex(a => a.InvestorId);
            e.HasIndex(a => a.InvestmentId);
            e.HasIndex(a => a.ProjectId);
            e.HasIndex(a => a.Type);
            e.HasIndex(a => a.ActivityDate);
            e.HasIndex(a => a.CreatedBy);
        });
    }
}
