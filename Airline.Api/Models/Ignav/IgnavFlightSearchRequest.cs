using System.Text.Json.Serialization;

namespace Airline.Api.Models.Ignav;

public class IgnavFlightSearchRequest
{
    [JsonPropertyName("origin")]
    public string Origin { get; set; } = string.Empty;

    [JsonPropertyName("destination")]
    public string Destination { get; set; } = string.Empty;

    [JsonPropertyName("departure_date")]
    public string DepartureDate { get; set; } = string.Empty;

    [JsonPropertyName("return_date")]
    public string? ReturnDate { get; set; }

    [JsonPropertyName("adults")]
    public int Adults { get; set; } = 1;

    [JsonPropertyName("children")]
    public int Children { get; set; }

    [JsonPropertyName("infants_on_lap")]
    public int InfantsOnLap { get; set; }

    [JsonPropertyName("cabin_class")]
    public string CabinClass { get; set; } = "economy";

    [JsonPropertyName("market")]
    public string Market { get; set; } = "US";
}
