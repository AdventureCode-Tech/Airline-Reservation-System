using Airline.Api.DTOs;
using Airline.Api.Helpers;

namespace Airline.Api.Interfaces;

public interface IAirportService
{
    ApiResponse<List<AirportSearchResponse>> SearchAirports(string? query);
}
