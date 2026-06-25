namespace Airline.Api.DTOs;

public class BookingPaymentDto
{
    public string CardLastFour { get; set; } = string.Empty;

    public string CardHolderName { get; set; } = string.Empty;

    public string ExpirationMonth { get; set; } = string.Empty;

    public string ExpirationYear { get; set; } = string.Empty;

    public string CardBrand { get; set; } = string.Empty;
}
