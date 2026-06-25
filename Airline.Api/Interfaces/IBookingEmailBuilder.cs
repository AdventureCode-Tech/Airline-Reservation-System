using Airline.Api.DTOs;

namespace Airline.Api.Interfaces;

public interface IBookingEmailBuilder
{
    string BuildCustomerConfirmationHtml(
        BookingRequest request,
        string bookingReference,
        string status,
        DateTime bookedAtUtc);

    string BuildAdminNotificationHtml(
        BookingRequest request,
        string bookingReference,
        string status,
        DateTime bookedAtUtc);
}
