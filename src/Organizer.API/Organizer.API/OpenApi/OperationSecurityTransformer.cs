using Microsoft.AspNetCore.OpenApi;
using Microsoft.OpenApi.Models;
using Organizer.API.Authentication;

namespace Organizer.API.OpenApi
{
    internal sealed class OperationSecurityTransformer() : IOpenApiOperationTransformer
    {
        public Task TransformAsync(OpenApiOperation operation, OpenApiOperationTransformerContext context, CancellationToken cancellationToken)
        {

            operation.Security = [new OpenApiSecurityRequirement {
                    {
                        new OpenApiSecurityScheme
                        {
                            Name = ApiKeyAuthOptions.HeaderName,
                            Type = SecuritySchemeType.ApiKey,
                            In = ParameterLocation.Header,
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = ApiKeyAuthOptions.ApiKeySchemaName
                            },
                         },
                         new string[] {}
                     }
                }];

            return Task.CompletedTask;
        }
    }
}
