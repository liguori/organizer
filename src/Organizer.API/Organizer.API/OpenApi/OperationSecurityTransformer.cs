using Microsoft.AspNetCore.OpenApi;
using Microsoft.OpenApi;
using Organizer.API.Authentication;

namespace Organizer.API.OpenApi
{
    internal sealed class OperationSecurityTransformer() : IOpenApiOperationTransformer
    {
        public Task TransformAsync(OpenApiOperation operation, OpenApiOperationTransformerContext context, CancellationToken cancellationToken)
        {
            operation.Security = [
                     new OpenApiSecurityRequirement
                        {
                            {
                                new OpenApiSecuritySchemeReference(ApiKeyAuthOptions.ApiKeySchemaName,context.Document),
                                [ ]
                            }
                        }
                 ];

            return Task.CompletedTask;
        }
    }
}
