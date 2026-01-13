var builder = DistributedApplication.CreateBuilder(args);

// Add the API project
var api = builder.AddProject<Projects.Organizer_API>("api")
    .WithExternalHttpEndpoints();

// Add the SPA project as a JavaScript app
var spa = builder.AddJavaScriptApp("spa", "../Organizer.SPA", "start")
    .WithHttpEndpoint(port: 4200, env: "PORT")
    .WithNpm(install: true)
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile();

builder.Build().Run();
