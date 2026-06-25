using System.Text.Json;
using Airline.Api.DTOs;
using Airline.Api.Helpers;
using Airline.Api.Interfaces;
using Airline.Api.Mappings;
using Airline.Api.Models;
using Airline.Api.Validators;

namespace Airline.Api.Services;

public class AirportService : IAirportService
{
    private static readonly Lazy<List<Airport>> Airports = new(LoadAirports);

    private static readonly List<Airport> InternationalAirports =
    [
        new() { Code = "LHR", Name = "London Heathrow Airport", City = "London", Country = "United Kingdom" },
        new() { Code = "CDG", Name = "Charles de Gaulle Airport", City = "Paris", Country = "France" },
        new() { Code = "DXB", Name = "Dubai International Airport", City = "Dubai", Country = "United Arab Emirates" },
        new() { Code = "SIN", Name = "Singapore Changi Airport", City = "Singapore", Country = "Singapore" },
        new() { Code = "SYD", Name = "Sydney Kingsford Smith Airport", City = "Sydney", Country = "Australia" },
        new() { Code = "NRT", Name = "Narita International Airport", City = "Tokyo", Country = "Japan" },
        new() { Code = "FRA", Name = "Frankfurt Airport", City = "Frankfurt", Country = "Germany" }
    ];

    private readonly AirportSearchValidator _validator;

    public AirportService(AirportSearchValidator validator)
    {
        _validator = validator;
    }

    public ApiResponse<List<AirportSearchResponse>> SearchAirports(string? query)
    {
        var validationErrors = _validator.Validate(query);
        if (validationErrors.Count > 0)
        {
            return ApiResponse<List<AirportSearchResponse>>.FailureResponse(
                validationErrors,
                "Validation failed.");
        }

        var normalizedQuery = query!.Trim();

        var results = Airports.Value
            .Where(airport =>
                airport.Code.Contains(normalizedQuery, StringComparison.OrdinalIgnoreCase) ||
                airport.Name.Contains(normalizedQuery, StringComparison.OrdinalIgnoreCase) ||
                airport.City.Contains(normalizedQuery, StringComparison.OrdinalIgnoreCase) ||
                airport.Country.Contains(normalizedQuery, StringComparison.OrdinalIgnoreCase) ||
                (!string.IsNullOrEmpty(airport.State) &&
                 airport.State.Contains(normalizedQuery, StringComparison.OrdinalIgnoreCase)))
            .Take(50)
            .ToSearchResponseList();

        return ApiResponse<List<AirportSearchResponse>>.SuccessResponse(
            results,
            "Airports retrieved successfully.");
    }

    private static List<Airport> LoadAirports()
    {
        var airports = new Dictionary<string, Airport>(StringComparer.OrdinalIgnoreCase);

        var dataPath = Path.Combine(AppContext.BaseDirectory, "Data", "us-airports.json");
        if (File.Exists(dataPath))
        {
            var json = File.ReadAllText(dataPath);
            var usAirports = JsonSerializer.Deserialize<List<Airport>>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (usAirports is not null)
            {
                foreach (var airport in usAirports)
                {
                    if (!string.IsNullOrWhiteSpace(airport.Code))
                    {
                        airports[airport.Code] = airport;
                    }
                }
            }
        }

        foreach (var airport in InternationalAirports)
        {
            airports.TryAdd(airport.Code, airport);
        }

        return airports.Values.OrderBy(a => a.Code).ToList();
    }
}
