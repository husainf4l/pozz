using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace PozzBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddActivitiesTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "activities",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CompanyId = table.Column<long>(type: "bigint", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    Title = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    Description = table.Column<string>(type: "character varying(5000)", maxLength: 5000, nullable: true),
                    InvestorId = table.Column<long>(type: "bigint", nullable: true),
                    InvestmentId = table.Column<long>(type: "bigint", nullable: true),
                    ProjectId = table.Column<long>(type: "bigint", nullable: true),
                    ActivityDate = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    Outcome = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    NextSteps = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    FollowUpDate = table.Column<DateOnly>(type: "date", nullable: true),
                    EmailSubject = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    EmailRecipients = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    CallDurationMinutes = table.Column<int>(type: "integer", nullable: true),
                    MeetingLocation = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                    MeetingAttendees = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    DocumentUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    DocumentName = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<long>(type: "bigint", nullable: false),
                    LastModifiedBy = table.Column<long>(type: "bigint", nullable: true),
                    IsPrivate = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_activities", x => x.Id);
                    table.ForeignKey(
                        name: "FK_activities_investments_InvestmentId",
                        column: x => x.InvestmentId,
                        principalTable: "investments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_activities_investors_InvestorId",
                        column: x => x.InvestorId,
                        principalTable: "investors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_activities_projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_activities_ActivityDate",
                table: "activities",
                column: "ActivityDate");

            migrationBuilder.CreateIndex(
                name: "IX_activities_CompanyId",
                table: "activities",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_activities_CreatedBy",
                table: "activities",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_activities_InvestmentId",
                table: "activities",
                column: "InvestmentId");

            migrationBuilder.CreateIndex(
                name: "IX_activities_InvestorId",
                table: "activities",
                column: "InvestorId");

            migrationBuilder.CreateIndex(
                name: "IX_activities_ProjectId",
                table: "activities",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_activities_Type",
                table: "activities",
                column: "Type");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "activities");
        }
    }
}
