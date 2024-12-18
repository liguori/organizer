using Microsoft.AspNetCore.OpenApi;
using Microsoft.OpenApi.Models;
using Organizer.API.Authentication;

namespace Organizer.API.OpenApi
{
    internal sealed class DocumentSecuritySchemeTransformer() : IOpenApiDocumentTransformer
    {
        public Task TransformAsync(OpenApiDocument document, OpenApiDocumentTransformerContext context, CancellationToken cancellationToken)
        {
            document.Info = new OpenApiInfo { Title = "Organizer", Version = "v1" };

            document.Components = new OpenApiComponents();
            document.Components.SecuritySchemes.Add(ApiKeyAuthOptions.ApiKeySchemaName, new OpenApiSecurityScheme
            {
                Description = "Api key needed to access the endpoints. " + ApiKeyAuthOptions.HeaderName + ": My_API_Key",
                In = ParameterLocation.Header,
                Name = ApiKeyAuthOptions.HeaderName,
                Type = SecuritySchemeType.ApiKey
            });

            return Task.CompletedTask;
        }
    }
}
