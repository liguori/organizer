using Microsoft.EntityFrameworkCore.Migrations;

namespace EngagementOrganizer.API.Migrations
{
    public partial class AddedTravelInformations : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "RequireTravel",
                table: "Appointments",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "TravelBooked",
                table: "Appointments",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RequireTravel",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "TravelBooked",
                table: "Appointments");
        }
    }
}
