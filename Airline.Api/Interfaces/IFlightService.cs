using Airline.Api.DTOs;

namespace Airline.Api.Interfaces;

public interface IFlightService
{
    Task<FlightResults> SearchFlightsAsync(
        FlightSearchRequest request,
        CancellationToken cancellationToken = default);
}
