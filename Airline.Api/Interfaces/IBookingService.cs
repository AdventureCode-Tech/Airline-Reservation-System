using Airline.Api.DTOs;

namespace Airline.Api.Interfaces;

public interface IBookingService
{
    Task<BookingResponse> CreateBookingAsync(
        BookingRequest request,
        CancellationToken cancellationToken = default);
}
