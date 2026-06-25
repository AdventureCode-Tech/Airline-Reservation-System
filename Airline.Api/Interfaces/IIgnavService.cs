namespace Airline.Api.Interfaces;

public interface IIgnavService
{
    Task<string> SearchOneWayFlightsAsync(object request, CancellationToken cancellationToken = default);

    Task<string> SearchRoundTripFlightsAsync(object request, CancellationToken cancellationToken = default);
}
