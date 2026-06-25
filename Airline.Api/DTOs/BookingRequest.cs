namespace Airline.Api.DTOs;

public class BookingRequest
{
    public string Email { get; set; } = string.Empty;

    public string Phone { get; set; } = string.Empty;

    public string Origin { get; set; } = string.Empty;

    public string Destination { get; set; } = string.Empty;

    public DateOnly DepartureDate { get; set; }

    public DateOnly? ReturnDate { get; set; }

    public string OfferId { get; set; } = string.Empty;

    public string TicketTier { get; set; } = "Basic";

    public decimal TicketTierAddon { get; set; }

    public bool WebCheckIn { get; set; }

    public decimal WebCheckInPrice { get; set; }

    public bool CancellationProtection { get; set; }

    public decimal CancellationProtectionPrice { get; set; }

    public decimal TotalAmount { get; set; }

    public string Currency { get; set; } = "USD";

    public int Adults { get; set; }

    public string TripType { get; set; } = "OneWay";

    public string CabinClass { get; set; } = "Economy";

    public decimal BasePricePerAdult { get; set; }

    public List<BookingFlightSegmentDto> OutboundSegments { get; set; } = [];

    public List<BookingFlightSegmentDto> ReturnSegments { get; set; } = [];

    public List<BookingPassengerDto> Passengers { get; set; } = [];

    public BookingPaymentDto Payment { get; set; } = new();

    public BookingBillingAddressDto BillingAddress { get; set; } = new();
}
