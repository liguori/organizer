using Microsoft.EntityFrameworkCore.Migrations;

namespace EngagementOrganizer.API.Migrations
{
    public partial class AddedShortDescriptionForAppointmentTypes : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.AddColumn<string>(
                name: "ShortDescription",
                table: "AppointmentType",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ShortDescription",
                table: "AppointmentType");
        }
    }
}
