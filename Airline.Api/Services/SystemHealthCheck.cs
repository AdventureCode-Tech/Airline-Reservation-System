using System.Text.Json;
using Airline.Api.Configurations;
using Airline.Api.Constants;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Options;

namespace Airline.Api.Services;

public class SystemHealthCheck : IHealthCheck
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IgnavOptions _ignavOptions;
    private readonly ILogger<SystemHealthCheck> _logger;

    public SystemHealthCheck(
        IHttpClientFactory httpClientFactory,
        IOptions<IgnavOptions> ignavOptions,
        ILogger<SystemHealthCheck> logger)
    {
        _httpClientFactory = httpClientFactory;
        _ignavOptions = ignavOptions.Value;
        _logger = logger;
    }

    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("System health check triggered.");

        var airportDataHealthy = CheckAirportData(out var airportMessage);
        var ignavHealthy = await CheckIgnavApiAsync(cancellationToken);

        if (airportDataHealthy && ignavHealthy)
        {
            _logger.LogInformation("System health check passed: All services are healthy.");
            return HealthCheckResult.Healthy("All systems are functional.");
        }

        var statusMessage = $"{(airportDataHealthy ? "" : "Airport data check failed: " + airportMessage + ". ")}{(ignavHealthy ? "" : "Ignav API check failed.")}";
        _logger.LogWarning("System health check completed with issues: {StatusMessage}", statusMessage);

        return new HealthCheckResult(
            context.Registration.FailureStatus,
            description: statusMessage);
    }

    private bool CheckAirportData(out string message)
    {
        var dataPath = Path.Combine(AppContext.BaseDirectory, "Data", "us-airports.json");
        if (!File.Exists(dataPath))
        {
            message = $"Airport data file not found at path: {dataPath}";
            _logger.LogError("{Message}", message);
            return false;
        }

        try
        {
            var fileInfo = new FileInfo(dataPath);
            if (fileInfo.Length == 0)
            {
                message = "Airport data file is empty (0 bytes).";
                _logger.LogError("{Message}", message);
                return false;
            }

            // Quick check if it is parseable JSON
            using (var fs = File.OpenRead(dataPath))
            {
                using (var doc = JsonDocument.Parse(fs))
                {
                    // Successfully parsed JSON
                }
            }

            message = "Airport data file is present and valid.";
            _logger.LogInformation("{Message}", message);
            return true;
        }
        catch (JsonException ex)
        {
            message = $"Airport data file contains invalid JSON: {ex.Message}";
            _logger.LogError(ex, "{Message}", message);
            return false;
        }
        catch (Exception ex)
        {
            message = $"Failed to read airport data file: {ex.Message}";
            _logger.LogError(ex, "{Message}", message);
            return false;
        }
    }

    private async Task<bool> CheckIgnavApiAsync(CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(_ignavOptions.BaseUrl))
        {
            _logger.LogWarning("Ignav BaseUrl is not configured.");
            return false;
        }

        try
        {
            var client = _httpClientFactory.CreateClient(IgnavConstants.HttpClientName);
            // Send a lightweight request (e.g. GET request to BaseUrl or empty path) to verify connectivity
            using var response = await client.GetAsync("", cancellationToken);
            _logger.LogInformation("Ignav API health check returned HTTP status code: {StatusCode}", response.StatusCode);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ignav API health check failed to connect to: {BaseUrl}", _ignavOptions.BaseUrl);
            return false;
        }
    }
}
