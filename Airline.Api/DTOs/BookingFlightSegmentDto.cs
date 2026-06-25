namespace Airline.Api.DTOs;

public class BookingFlightSegmentDto
{
    public string FlightNumber { get; set; } = string.Empty;

    public string Airline { get; set; } = string.Empty;

    public string CarrierCode { get; set; } = string.Empty;

    public string Origin { get; set; } = string.Empty;

    public string Destination { get; set; } = string.Empty;

    public string DepartureTime { get; set; } = string.Empty;

    public string ArrivalTime { get; set; } = string.Empty;

    public int DurationMinutes { get; set; }
}
