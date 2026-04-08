using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace PozzBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddInvestmentsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "investments",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    InvestorId = table.Column<long>(type: "bigint", nullable: false),
                    ProjectId = table.Column<long>(type: "bigint", nullable: true),
                    CompanyId = table.Column<long>(type: "bigint", nullable: false),
                    CommittedAmount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    PaidAmount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false, defaultValue: 0m),
                    EquityPercentage = table.Column<decimal>(type: "numeric(10,4)", precision: 10, scale: 4, nullable: false),
                    Instrument = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    PaymentStatus = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    ValuationCap = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: true),
                    DiscountRate = table.Column<decimal>(type: "numeric(5,2)", precision: 5, scale: 2, nullable: true),
                    InterestRate = table.Column<decimal>(type: "numeric(5,2)", precision: 5, scale: 2, nullable: true),
                    MaturityDate = table.Column<DateOnly>(type: "date", nullable: true),
                    CommitmentDate = table.Column<DateOnly>(type: "date", nullable: false),
                    ClosingDate = table.Column<DateOnly>(type: "date", nullable: true),
                    FirstPaymentDate = table.Column<DateOnly>(type: "date", nullable: true),
                    FinalPaymentDate = table.Column<DateOnly>(type: "date", nullable: true),
                    TermSheetUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    AgreementUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    ShareCertificateUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    ShareCertificateNumber = table.Column<long>(type: "bigint", nullable: true),
                    HasBoardSeat = table.Column<bool>(type: "boolean", nullable: false),
                    HasVetoRights = table.Column<bool>(type: "boolean", nullable: false),
                    HasInformationRights = table.Column<bool>(type: "boolean", nullable: false),
                    LiquidationPreferenceMultiple = table.Column<int>(type: "integer", nullable: true),
                    IsParticipating = table.Column<bool>(type: "boolean", nullable: false),
                    HasAntiDilution = table.Column<bool>(type: "boolean", nullable: false),
                    AntiDilutionType = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    Notes = table.Column<string>(type: "text", nullable: true),
                    InternalReference = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    Status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<long>(type: "bigint", nullable: true),
                    LastModifiedBy = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_investments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_investments_investors_InvestorId",
                        column: x => x.InvestorId,
                        principalTable: "investors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_investments_projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_investments_CommitmentDate",
                table: "investments",
                column: "CommitmentDate");

            migrationBuilder.CreateIndex(
                name: "IX_investments_CompanyId",
                table: "investments",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_investments_InvestorId",
                table: "investments",
                column: "InvestorId");

            migrationBuilder.CreateIndex(
                name: "IX_investments_PaymentStatus",
                table: "investments",
                column: "PaymentStatus");

            migrationBuilder.CreateIndex(
                name: "IX_investments_ProjectId",
                table: "investments",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_investments_Status",
                table: "investments",
                column: "Status");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "investments");
        }
    }
}
