using System.Text.Json;
using Airline.Api.DTOs;
using Airline.Api.Models.Ignav;

namespace Airline.Api.Mappings;

public static class FlightMappings
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    public static IgnavFlightSearchRequest ToIgnavRequest(this FlightSearchRequest request)
    {
        return new IgnavFlightSearchRequest
        {
            Origin = request.Origin,
            Destination = request.Destination,
            DepartureDate = request.DepartureDate.ToString("yyyy-MM-dd"),
            ReturnDate = request.ReturnDate?.ToString("yyyy-MM-dd"),
            Adults = request.Adults
        };
    }

    public static FlightResults ToFlightResults(string rawJson, bool isRoundTrip)
    {
        var ignavResult = JsonSerializer.Deserialize<IgnavFlightSearchResult>(rawJson, JsonOptions)
            ?? new IgnavFlightSearchResult();

        return new FlightResults
        {
            TripType = isRoundTrip ? "RoundTrip" : "OneWay",
            Offers = ignavResult.Itineraries.Select(MapOffer).ToList()
        };
    }

    private static FlightOfferResponse MapOffer(IgnavFlightOffer offer)
    {
        return new FlightOfferResponse
        {
            OfferId = offer.Id,
            TotalPrice = offer.Price?.Amount ?? 0,
            Currency = offer.Price?.Currency ?? string.Empty,
            OutboundSegments = MapLegSegments(offer.Outbound),
            ReturnSegments = MapLegSegments(offer.Inbound)
        };
    }

    private static List<FlightSegmentResponse> MapLegSegments(IgnavFlightLeg? leg)
    {
        if (leg is null)
        {
            return [];
        }

        return leg.Segments.Select(MapSegment).ToList();
    }

    private static FlightSegmentResponse MapSegment(IgnavFlightSegment segment)
    {
        return new FlightSegmentResponse
        {
            FlightNumber = $"{segment.MarketingCarrierCode}{segment.FlightNumber}",
            Airline = segment.OperatingCarrierName,
            CarrierCode = segment.MarketingCarrierCode,
            Origin = segment.DepartureAirport,
            Destination = segment.ArrivalAirport,
            DepartureTime = segment.DepartureTimeUtc,
            ArrivalTime = segment.ArrivalTimeUtc,
            DurationMinutes = segment.DurationMinutes
        };
    }
}
