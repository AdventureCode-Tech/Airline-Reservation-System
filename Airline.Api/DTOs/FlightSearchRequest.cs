namespace Airline.Api.DTOs;

public class FlightSearchRequest
{
    public string Origin { get; set; } = string.Empty;

    public string Destination { get; set; } = string.Empty;

    public DateOnly DepartureDate { get; set; }

    public DateOnly? ReturnDate { get; set; }

    public int Adults { get; set; } = 1;

    public int Children { get; set; }

    public int Infants { get; set; }

    public string? CabinClass { get; set; }
}
