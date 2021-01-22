using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace EngagementOrganizer.API.Migrations
{
    public partial class InitialMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AppointmentType",
                columns: table => new
                {
                    ID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    Billable = table.Column<bool>(type: "INTEGER", nullable: false),
                    RequireCustomer = table.Column<bool>(type: "INTEGER", nullable: false),
                    Color = table.Column<string>(type: "TEXT", nullable: true),
                    TextColor = table.Column<string>(type: "TEXT", nullable: true),
                    ShortDescription = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppointmentType", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Calendars",
                columns: table => new
                {
                    CalendarName = table.Column<string>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    Color = table.Column<string>(type: "TEXT", nullable: true),
                    TextColor = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Calendars", x => x.CalendarName);
                });

            migrationBuilder.CreateTable(
                name: "Customers",
                columns: table => new
                {
                    ID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: true),
                    ShortDescription = table.Column<string>(type: "TEXT", nullable: true),
                    Color = table.Column<string>(type: "TEXT", nullable: true),
                    TextColor = table.Column<string>(type: "TEXT", nullable: true),
                    ProjectColors = table.Column<string>(type: "TEXT", nullable: true),
                    Referral = table.Column<string>(type: "TEXT", nullable: true),
                    Address = table.Column<string>(type: "TEXT", nullable: true),
                    Note = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Customers", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Appointments",
                columns: table => new
                {
                    ID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    CustomerID = table.Column<int>(type: "INTEGER", nullable: true),
                    Project = table.Column<string>(type: "TEXT", nullable: true),
                    TypeID = table.Column<int>(type: "INTEGER", nullable: false),
                    AvailabilityID = table.Column<int>(type: "INTEGER", nullable: true),
                    StartDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    EndDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Note = table.Column<string>(type: "TEXT", nullable: true),
                    Confirmed = table.Column<bool>(type: "INTEGER", nullable: false),
                    RequireTravel = table.Column<bool>(type: "INTEGER", nullable: false),
                    TravelBooked = table.Column<bool>(type: "INTEGER", nullable: false),
                    CalendarName = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Appointments", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Appointments_AppointmentType_TypeID",
                        column: x => x.TypeID,
                        principalTable: "AppointmentType",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Appointments_Customers_CustomerID",
                        column: x => x.CustomerID,
                        principalTable: "Customers",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "AppointmentType",
                columns: new[] { "ID", "Billable", "Color", "Description", "RequireCustomer", "ShortDescription", "TextColor" },
                values: new object[] { 1, true, null, "Delivery", true, null, null });

            migrationBuilder.InsertData(
                table: "AppointmentType",
                columns: new[] { "ID", "Billable", "Color", "Description", "RequireCustomer", "ShortDescription", "TextColor" },
                values: new object[] { 2, true, "#ffe95b", "Sickness", false, "SICK", "#000000" });

            migrationBuilder.InsertData(
                table: "AppointmentType",
                columns: new[] { "ID", "Billable", "Color", "Description", "RequireCustomer", "ShortDescription", "TextColor" },
                values: new object[] { 3, false, null, "Shadowing", true, null, null });

            migrationBuilder.InsertData(
                table: "AppointmentType",
                columns: new[] { "ID", "Billable", "Color", "Description", "RequireCustomer", "ShortDescription", "TextColor" },
                values: new object[] { 4, false, "#cecece", "Holiday", false, "H", "#000000" });

            migrationBuilder.InsertData(
                table: "AppointmentType",
                columns: new[] { "ID", "Billable", "Color", "Description", "RequireCustomer", "ShortDescription", "TextColor" },
                values: new object[] { 5, false, "#efb8b8", "National Celebration", false, "CEL", "#000000" });

            migrationBuilder.InsertData(
                table: "AppointmentType",
                columns: new[] { "ID", "Billable", "Color", "Description", "RequireCustomer", "ShortDescription", "TextColor" },
                values: new object[] { 6, false, "#3087c1", "Company Event", false, "COM", "#ffffff" });

            migrationBuilder.InsertData(
                table: "AppointmentType",
                columns: new[] { "ID", "Billable", "Color", "Description", "RequireCustomer", "ShortDescription", "TextColor" },
                values: new object[] { 7, false, "#97ff8c", "Blocker", false, "B", "#000000" });

            migrationBuilder.InsertData(
                table: "AppointmentType",
                columns: new[] { "ID", "Billable", "Color", "Description", "RequireCustomer", "ShortDescription", "TextColor" },
                values: new object[] { 99, true, "#0000ff", "Upstream Calendar", false, "Upstream", "#ffffff" });

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_CustomerID",
                table: "Appointments",
                column: "CustomerID");

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_TypeID",
                table: "Appointments",
                column: "TypeID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Appointments");

            migrationBuilder.DropTable(
                name: "Calendars");

            migrationBuilder.DropTable(
                name: "AppointmentType");

            migrationBuilder.DropTable(
                name: "Customers");
        }
    }
}
