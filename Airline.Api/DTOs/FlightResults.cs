namespace Airline.Api.DTOs;

public class FlightResults
{
    public string TripType { get; set; } = string.Empty;

    public List<FlightOfferResponse> Offers { get; set; } = [];
}

public class FlightOfferResponse
{
    public string OfferId { get; set; } = string.Empty;

    public decimal TotalPrice { get; set; }

    public string Currency { get; set; } = string.Empty;

    public string? CabinClass { get; set; }

    public List<FlightSegmentResponse> OutboundSegments { get; set; } = [];

    public List<FlightSegmentResponse> ReturnSegments { get; set; } = [];
}

public class FlightSegmentResponse
{
    public string FlightNumber { get; set; } = string.Empty;

    public string Airline { get; set; } = string.Empty;

    public string CarrierCode { get; set; } = string.Empty;

    public string Origin { get; set; } = string.Empty;

    public string Destination { get; set; } = string.Empty;

    /// <summary>Airport-local departure time (wall clock at origin airport).</summary>
    public string DepartureTime { get; set; } = string.Empty;

    /// <summary>Airport-local arrival time (wall clock at destination airport).</summary>
    public string ArrivalTime { get; set; } = string.Empty;

    /// <summary>UTC departure instant for layover calculations.</summary>
    public string? DepartureTimeUtc { get; set; }

    /// <summary>UTC arrival instant for layover calculations.</summary>
    public string? ArrivalTimeUtc { get; set; }

    public string? DepartureTimezone { get; set; }

    public string? ArrivalTimezone { get; set; }

    public int DurationMinutes { get; set; }
}
