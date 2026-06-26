using System.Text.Json.Serialization;

namespace Airline.Api.Models.Ignav;

public class IgnavFlightSearchResult
{
    [JsonPropertyName("itineraries")]
    public List<IgnavFlightOffer> Itineraries { get; set; } = [];
}

public class IgnavFlightOffer
{
    [JsonPropertyName("ignav_id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("price")]
    public IgnavPrice? Price { get; set; }

    [JsonPropertyName("outbound")]
    public IgnavFlightLeg? Outbound { get; set; }

    [JsonPropertyName("inbound")]
    public IgnavFlightLeg? Inbound { get; set; }

    [JsonPropertyName("cabin_class")]
    public string? CabinClass { get; set; }
}

public class IgnavPrice
{
    [JsonPropertyName("amount")]
    public decimal Amount { get; set; }

    [JsonPropertyName("currency")]
    public string Currency { get; set; } = string.Empty;
}

public class IgnavFlightLeg
{
    [JsonPropertyName("carrier")]
    public string Carrier { get; set; } = string.Empty;

    [JsonPropertyName("duration_minutes")]
    public int DurationMinutes { get; set; }

    [JsonPropertyName("segments")]
    public List<IgnavFlightSegment> Segments { get; set; } = [];
}

public class IgnavFlightSegment
{
    [JsonPropertyName("marketing_carrier_code")]
    public string MarketingCarrierCode { get; set; } = string.Empty;

    [JsonPropertyName("flight_number")]
    public string FlightNumber { get; set; } = string.Empty;

    [JsonPropertyName("operating_carrier_name")]
    public string OperatingCarrierName { get; set; } = string.Empty;

    [JsonPropertyName("departure_airport")]
    public string DepartureAirport { get; set; } = string.Empty;

    [JsonPropertyName("departure_time_local")]
    public string DepartureTimeLocal { get; set; } = string.Empty;

    [JsonPropertyName("departure_timezone")]
    public string? DepartureTimezone { get; set; }

    [JsonPropertyName("departure_time_utc")]
    public string? DepartureTimeUtc { get; set; }

    [JsonPropertyName("arrival_airport")]
    public string ArrivalAirport { get; set; } = string.Empty;

    [JsonPropertyName("arrival_time_local")]
    public string ArrivalTimeLocal { get; set; } = string.Empty;

    [JsonPropertyName("arrival_timezone")]
    public string? ArrivalTimezone { get; set; }

    [JsonPropertyName("arrival_time_utc")]
    public string? ArrivalTimeUtc { get; set; }

    [JsonPropertyName("duration_minutes")]
    public int DurationMinutes { get; set; }
}
