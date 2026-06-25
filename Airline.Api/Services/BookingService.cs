using Airline.Api.Configurations;
using Airline.Api.Constants;
using Airline.Api.DTOs;
using Airline.Api.Interfaces;
using Airline.Api.Services;
using Microsoft.Extensions.Options;

namespace Airline.Api.Services;

public class BookingService : IBookingService
{
    private readonly IReferenceGeneratorService _referenceGeneratorService;
    private readonly IEmailService _emailService;
    private readonly IBookingEmailBuilder _emailBuilder;
    private readonly EmailOptions _emailOptions;
    private readonly ILogger<BookingService> _logger;

    public BookingService(
        IReferenceGeneratorService referenceGeneratorService,
        IEmailService emailService,
        IBookingEmailBuilder emailBuilder,
        IOptions<EmailOptions> emailOptions,
        ILogger<BookingService> logger)
    {
        _referenceGeneratorService = referenceGeneratorService;
        _emailService = emailService;
        _emailBuilder = emailBuilder;
        _emailOptions = emailOptions.Value;
        _logger = logger;
    }

    public async Task<BookingResponse> CreateBookingAsync(
        BookingRequest request,
        CancellationToken cancellationToken = default)
    {
        var bookingReference = _referenceGeneratorService.GenerateBookingReference();
        var status = BookingConstants.StatusInProgress;
        var bookedAt = DateTime.UtcNow;

        var customerHtml = _emailBuilder.BuildCustomerConfirmationHtml(
            request, bookingReference, status, bookedAt);
        await TrySendEmailAsync(
            request.Email,
            $"Flight Confirmation — {status} ({bookingReference})",
            customerHtml,
            "customer",
            bookingReference,
            cancellationToken);

        if (!string.IsNullOrWhiteSpace(_emailOptions.NotificationEmail))
        {
            var adminHtml = _emailBuilder.BuildAdminNotificationHtml(
                request, bookingReference, status, bookedAt);
            await TrySendEmailAsync(
                _emailOptions.NotificationEmail.Trim(),
                $"[Action Required] New Booking {bookingReference} — {FormatMoney(request.Currency, request.TotalAmount)}",
                adminHtml,
                "admin",
                bookingReference,
                cancellationToken);
        }

        return new BookingResponse
        {
            BookingReference = bookingReference,
            Status = status
        };
    }

    private static string FormatMoney(string currency, decimal amount) =>
        $"{currency} {amount:0.00}";

    private async Task TrySendEmailAsync(        string recipientEmail,
        string subject,
        string htmlContent,
        string emailRole,
        string bookingReference,
        CancellationToken cancellationToken)
    {
        try
        {
            await _emailService.SendHtmlEmail(
                recipientEmail,
                subject,
                htmlContent,
                cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Failed to send {EmailRole} email for booking {BookingReference} to {Email}. Booking was still created.",
                emailRole,
                bookingReference,
                recipientEmail);
        }
    }
}
