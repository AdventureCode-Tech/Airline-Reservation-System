using Airline.Api.DTOs;
using Airline.Api.Interfaces;
using Airline.Api.Mappings;

namespace Airline.Api.Services;

public class FlightService : IFlightService
{
    private readonly IIgnavService _ignavService;

    public FlightService(IIgnavService ignavService)
    {
        _ignavService = ignavService;
    }

    public async Task<FlightResults> SearchFlightsAsync(
        FlightSearchRequest request,
        CancellationToken cancellationToken = default)
    {
        var ignavRequest = request.ToIgnavRequest();
        var isRoundTrip = request.ReturnDate.HasValue;

        var rawResponse = isRoundTrip
            ? await _ignavService.SearchRoundTripFlightsAsync(ignavRequest, cancellationToken)
            : await _ignavService.SearchOneWayFlightsAsync(ignavRequest, cancellationToken);

        return FlightMappings.ToFlightResults(rawResponse, isRoundTrip);
    }
}
