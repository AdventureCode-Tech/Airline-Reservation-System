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

    public DateTime DepartureTime { get; set; }

    public DateTime ArrivalTime { get; set; }

    public int DurationMinutes { get; set; }
}
