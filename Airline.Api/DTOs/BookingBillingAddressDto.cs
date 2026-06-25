namespace Airline.Api.DTOs;

public class BookingBillingAddressDto
{
    public string StreetAddress { get; set; } = string.Empty;

    public string AptSuite { get; set; } = string.Empty;

    public string City { get; set; } = string.Empty;

    public string State { get; set; } = string.Empty;

    public string ZipCode { get; set; } = string.Empty;

    public string Country { get; set; } = string.Empty;
}
