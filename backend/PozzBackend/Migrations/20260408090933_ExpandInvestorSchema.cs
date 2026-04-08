using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PozzBackend.Migrations
{
    /// <inheritdoc />
    public partial class ExpandInvestorSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AddressLine1",
                table: "investors",
                type: "character varying(300)",
                maxLength: 300,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AddressLine2",
                table: "investors",
                type: "character varying(300)",
                maxLength: 300,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "City",
                table: "investors",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Country",
                table: "investors",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "CreatedBy",
                table: "investors",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<string[]>(
                name: "InvestmentFocus",
                table: "investors",
                type: "text[]",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "InvestmentRange",
                table: "investors",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "LastContactDate",
                table: "investors",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "LastModifiedBy",
                table: "investors",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LinkedInUrl",
                table: "investors",
                type: "character varying(300)",
                maxLength: 300,
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "NextFollowUpDate",
                table: "investors",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NotableInvestments",
                table: "investors",
                type: "character varying(2000)",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PipelineStage",
                table: "investors",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PortfolioCompanies",
                table: "investors",
                type: "character varying(2000)",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Position",
                table: "investors",
                type: "character varying(150)",
                maxLength: 150,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PostalCode",
                table: "investors",
                type: "character varying(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "PotentialInvestmentAmount",
                table: "investors",
                type: "numeric(18,2)",
                precision: 18,
                scale: 2,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PreferredInvestmentInstrument",
                table: "investors",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PreviousExits",
                table: "investors",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PrimaryEmail",
                table: "investors",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PrimaryPhone",
                table: "investors",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Priority",
                table: "investors",
                type: "integer",
                nullable: false,
                defaultValue: 3);

            migrationBuilder.AddColumn<string>(
                name: "SecondaryEmail",
                table: "investors",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SecondaryPhone",
                table: "investors",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Source",
                table: "investors",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "State",
                table: "investors",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Tags",
                table: "investors",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TwitterHandle",
                table: "investors",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Website",
                table: "investors",
                type: "character varying(300)",
                maxLength: 300,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "YearsOfExperience",
                table: "investors",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_investors_LastContactDate",
                table: "investors",
                column: "LastContactDate");

            migrationBuilder.CreateIndex(
                name: "IX_investors_PipelineStage",
                table: "investors",
                column: "PipelineStage");

            migrationBuilder.CreateIndex(
                name: "IX_investors_PrimaryEmail",
                table: "investors",
                column: "PrimaryEmail");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_investors_LastContactDate",
                table: "investors");

            migrationBuilder.DropIndex(
                name: "IX_investors_PipelineStage",
                table: "investors");

            migrationBuilder.DropIndex(
                name: "IX_investors_PrimaryEmail",
                table: "investors");

            migrationBuilder.DropColumn(
                name: "AddressLine1",
                table: "investors");

            migrationBuilder.DropColumn(
                name: "AddressLine2",
                table: "investors");

            migrationBuilder.DropColumn(
                name: "City",
                table: "investors");

            migrationBuilder.DropColumn(
                name: "Country",
                table: "investors");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "investors");

            migrationBuilder.DropColumn(
                name: "InvestmentFocus",
                table: "investors");

            migrationBuilder.DropColumn(
                name: "InvestmentRange",
                table: "investors");

            migrationBuilder.DropColumn(
                name: "LastContactDate",
                table: "investors");

            migrationBuilder.DropColumn(
                name: "LastModifiedBy",
                table: "investors");

            migrationBuilder.DropColumn(
                name: "LinkedInUrl",
                table: "investors");

            migrationBuilder.DropColumn(
                name: "NextFollowUpDate",
                table: "investors");

            migrationBuilder.DropColumn(
                name: "NotableInvestments",
                table: "investors");

            migrationBuilder.DropColumn(
                name: "PipelineStage",
                table: "investors");

            migrationBuilder.DropColumn(
                name: "PortfolioCompanies",
                table: "investors");

            migrationBuilder.DropColumn(
                name: "Position",
                table: "investors");

            migrationBuilder.DropColumn(
                name: "PostalCode",
                table: "investors");

            migrationBuilder.DropColumn(
                name: "PotentialInvestmentAmount",
                table: "investors");

            migrationBuilder.DropColumn(
                name: "PreferredInvestmentInstrument",
                table: "investors");

            migrationBuilder.DropColumn(
                name: "PreviousExits",
                table: "investors");

            migrationBuilder.DropColumn(
                name: "PrimaryEmail",
                table: "investors");

            migrationBuilder.DropColumn(
                name: "PrimaryPhone",
                table: "investors");

            migrationBuilder.DropColumn(
                name: "Priority",
                table: "investors");

            migrationBuilder.DropColumn(
                name: "SecondaryEmail",
                table: "investors");

            migrationBuilder.DropColumn(
                name: "SecondaryPhone",
                table: "investors");

            migrationBuilder.DropColumn(
                name: "Source",
                table: "investors");

            migrationBuilder.DropColumn(
                name: "State",
                table: "investors");

            migrationBuilder.DropColumn(
                name: "Tags",
                table: "investors");

            migrationBuilder.DropColumn(
                name: "TwitterHandle",
                table: "investors");

            migrationBuilder.DropColumn(
                name: "Website",
                table: "investors");

            migrationBuilder.DropColumn(
                name: "YearsOfExperience",
                table: "investors");
        }
    }
}
