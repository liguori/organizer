using Microsoft.EntityFrameworkCore.Migrations;

namespace EngagementOrganizer.API.Migrations
{
    public partial class AddedProjectField : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Project",
                table: "Appointments",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Project",
                table: "Appointments");
        }
    }
}
