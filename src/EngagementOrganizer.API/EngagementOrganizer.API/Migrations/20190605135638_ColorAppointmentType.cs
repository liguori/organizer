using Microsoft.EntityFrameworkCore.Migrations;

namespace EngagementOrganizer.API.Migrations
{
    public partial class ColorAppointmentType : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Color",
                table: "AppointmentType",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TextColor",
                table: "AppointmentType",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Color",
                table: "AppointmentType");

            migrationBuilder.DropColumn(
                name: "TextColor",
                table: "AppointmentType");
        }
    }
}
