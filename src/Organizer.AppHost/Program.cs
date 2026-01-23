var builder = DistributedApplication.CreateBuilder(args);

// Add the API project
var api = builder.AddProject<Projects.Organizer_API>("api")
    .WithExternalHttpEndpoints();

// Add the SPA project as a JavaScript app
var spa = builder.AddJavaScriptApp("spa", "../Organizer.SPA", "start")
    .WithHttpEndpoint(targetPort: 4200)
    .WithReference(api)
    .WithNpm(install: true)
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile();

builder.Build().Run();
