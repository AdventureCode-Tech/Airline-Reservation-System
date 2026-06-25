using Airline.Api.DTOs;
using Airline.Api.Models;

namespace Airline.Api.Mappings;

public static class AirportMappings
{
    public static AirportSearchResponse ToSearchResponse(this Airport airport)
    {
        return new AirportSearchResponse
        {
            Code = airport.Code,
            Name = airport.Name,
            City = airport.City,
            Country = airport.Country,
            State = airport.State
        };
    }

    public static List<AirportSearchResponse> ToSearchResponseList(this IEnumerable<Airport> airports)
    {
        return airports.Select(airport => airport.ToSearchResponse()).ToList();
    }
}
