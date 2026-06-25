using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using Airline.Api.Configurations;
using Airline.Api.Constants;
using Airline.Api.Interfaces;
using Microsoft.Extensions.Options;

namespace Airline.Api.Services;

public class IgnavService : IIgnavService
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
    };

    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IgnavOptions _options;

    public IgnavService(IHttpClientFactory httpClientFactory, IOptions<IgnavOptions> options)
    {
        _httpClientFactory = httpClientFactory;
        _options = options.Value;
    }

    public Task<string> SearchOneWayFlightsAsync(object request, CancellationToken cancellationToken = default)
    {
        return SendSearchRequestAsync(IgnavConstants.OneWaySearchPath, request, cancellationToken);
    }

    public Task<string> SearchRoundTripFlightsAsync(object request, CancellationToken cancellationToken = default)
    {
        return SendSearchRequestAsync(IgnavConstants.RoundTripSearchPath, request, cancellationToken);
    }

    private async Task<string> SendSearchRequestAsync(
        string path,
        object request,
        CancellationToken cancellationToken)
    {
        var client = _httpClientFactory.CreateClient(IgnavConstants.HttpClientName);

        using var requestMessage = new HttpRequestMessage(HttpMethod.Post, path)
        {
            Content = JsonContent.Create(request, options: JsonOptions)
        };

        if (!string.IsNullOrWhiteSpace(_options.ApiKey))
        {
            requestMessage.Headers.Add("X-Api-Key", _options.ApiKey);
        }

        using var response = await client.SendAsync(requestMessage, cancellationToken);

        return await response.Content.ReadAsStringAsync(cancellationToken);
    }
}
