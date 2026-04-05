using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using PozzBackend.Common.Application;
using PozzBackend.Common.Infrastructure;
using PozzBackend.Common.Infrastructure.Authorization;
using PozzBackend.Modules.Auth;
using PozzBackend.Modules.Auth.Domain;
using PozzBackend.Modules.Companies;
using PozzBackend.Modules.Investors;
using PozzBackend.Modules.Onboarding;
using PozzBackend.Modules.Roles;
using PozzBackend.Modules.Users;

var builder = WebApplication.CreateBuilder(args);

// ── Database ───────────────────────────────────────────────────────────────────
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// ── Identity (Microsoft Identity with custom user/role) ───────────────────────
builder.Services.AddIdentity<ApplicationUser, ApplicationRole>(options =>
{
    options.Password.RequiredLength = 8;
    options.Password.RequireUppercase = true;
    options.Password.RequireDigit = true;
    options.Password.RequireNonAlphanumeric = false;
    options.User.RequireUniqueEmail = true;
    options.SignIn.RequireConfirmedEmail = false;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

// ── JWT Authentication ────────────────────────────────────────────────────────
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secret = jwtSettings["Secret"]!;

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret)),
        ClockSkew = TimeSpan.Zero
    };
});

// ── Authorization: permission-based policy ────────────────────────────────────
builder.Services.AddSingleton<IAuthorizationPolicyProvider, PermissionPolicyProvider>();
builder.Services.AddSingleton<IAuthorizationHandler, PermissionAuthorizationHandler>();
builder.Services.AddAuthorization();

// ── Unit of Work ──────────────────────────────────────────────────────────────
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// ── Business Modules ──────────────────────────────────────────────────────────
builder.Services
    .AddAuthModule()
    .AddUsersModule()
    .AddRolesModule()
    .AddCompaniesModule()
    .AddInvestorsModule()
    .AddOnboardingModule();

// ── Data Seeder ───────────────────────────────────────────────────────────────
builder.Services.AddScoped<DataSeeder>();

// ── Controllers + Swagger ─────────────────────────────────────────────────────
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Pozz API", Version = "v1" });

    // JWT bearer scheme for Swagger UI
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter your JWT token (without 'Bearer ' prefix)"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });
});

// ── CORS ──────────────────────────────────────────────────────────────────────
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy
            .WithOrigins(
                "https://app.pozz.io",
                "https://admin.pozz.io",
                "http://localhost:4200",
                "http://localhost:4201",
                "http://localhost:4202",
                "http://localhost:4203"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials());
});

// ─────────────────────────────────────────────────────────────────────────────
var app = builder.Build();

// ── Migrations + Seeding ──────────────────────────────────────────────────────
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    await db.Database.MigrateAsync();

    var seeder = scope.ServiceProvider.GetRequiredService<DataSeeder>();
    await seeder.SeedAsync();
}

// ── Middleware pipeline ───────────────────────────────────────────────────────
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
