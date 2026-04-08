using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PozzBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddEnhancedProjectFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "BusinessModel",
                table: "projects",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CurrentStatusSummary",
                table: "projects",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "InternalNotes",
                table: "projects",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PitchDeckUrl",
                table: "projects",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PrimaryGoal",
                table: "projects",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Stage",
                table: "projects",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Tags",
                table: "projects",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TargetMarket",
                table: "projects",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WebsiteUrl",
                table: "projects",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BusinessModel",
                table: "projects");

            migrationBuilder.DropColumn(
                name: "CurrentStatusSummary",
                table: "projects");

            migrationBuilder.DropColumn(
                name: "InternalNotes",
                table: "projects");

            migrationBuilder.DropColumn(
                name: "PitchDeckUrl",
                table: "projects");

            migrationBuilder.DropColumn(
                name: "PrimaryGoal",
                table: "projects");

            migrationBuilder.DropColumn(
                name: "Stage",
                table: "projects");

            migrationBuilder.DropColumn(
                name: "Tags",
                table: "projects");

            migrationBuilder.DropColumn(
                name: "TargetMarket",
                table: "projects");

            migrationBuilder.DropColumn(
                name: "WebsiteUrl",
                table: "projects");
        }
    }
}
