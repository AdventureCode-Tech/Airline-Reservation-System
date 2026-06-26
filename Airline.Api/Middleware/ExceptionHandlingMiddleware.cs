using System.Net;
using Airline.Api.Helpers;

namespace Airline.Api.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception occurred while processing the request.");

            if (context.Response.HasStarted)
            {
                throw;
            }

            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        var statusCode = exception switch
        {
            HttpRequestException http when http.StatusCode.HasValue => (int)http.StatusCode.Value,
            _ => (int)HttpStatusCode.InternalServerError
        };

        context.Response.StatusCode = statusCode;

        var message = statusCode == (int)HttpStatusCode.InternalServerError
            ? "Internal Server Error"
            : "Request failed.";

        var response = ApiResponse<object?>.FailureResponse(
            [exception.Message],
            message);

        await context.Response.WriteAsJsonAsync(response);
    }
}
