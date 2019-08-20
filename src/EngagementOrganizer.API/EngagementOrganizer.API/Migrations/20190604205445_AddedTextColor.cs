using Microsoft.EntityFrameworkCore.Migrations;

namespace EngagementOrganizer.API.Migrations
{
    public partial class AddedTextColor : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TextColor",
                table: "Customers",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TextColor",
                table: "Customers");
        }
    }
}
