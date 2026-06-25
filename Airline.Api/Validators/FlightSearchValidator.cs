using Airline.Api.DTOs;

namespace Airline.Api.Validators;

public class FlightSearchValidator
{
    public List<string> Validate(FlightSearchRequest request)
    {
        var errors = new List<string>();

        if (string.IsNullOrWhiteSpace(request.Origin))
        {
            errors.Add("Origin is required.");
        }
        else if (request.Origin.Trim().Length != 3)
        {
            errors.Add("Origin must be a 3-letter airport code.");
        }

        if (string.IsNullOrWhiteSpace(request.Destination))
        {
            errors.Add("Destination is required.");
        }
        else if (request.Destination.Trim().Length != 3)
        {
            errors.Add("Destination must be a 3-letter airport code.");
        }

        if (!string.IsNullOrWhiteSpace(request.Origin) &&
            !string.IsNullOrWhiteSpace(request.Destination) &&
            request.Origin.Trim().Equals(request.Destination.Trim(), StringComparison.OrdinalIgnoreCase))
        {
            errors.Add("Origin and destination must be different.");
        }

        if (request.DepartureDate == default)
        {
            errors.Add("Departure date is required.");
        }
        else if (request.DepartureDate < DateOnly.FromDateTime(DateTime.UtcNow))
        {
            errors.Add("Departure date cannot be in the past.");
        }

        if (request.ReturnDate.HasValue && request.ReturnDate.Value < request.DepartureDate)
        {
            errors.Add("Return date must be on or after the departure date.");
        }

        if (request.Adults < 1)
        {
            errors.Add("At least one adult passenger is required.");
        }

        return errors;
    }

    public bool IsValid(FlightSearchRequest request) => Validate(request).Count == 0;
}
