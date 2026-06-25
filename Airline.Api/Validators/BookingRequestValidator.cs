using System.Net.Mail;
using System.Text.RegularExpressions;
using Airline.Api.DTOs;

namespace Airline.Api.Validators;

public partial class BookingRequestValidator
{
    private static readonly HashSet<string> AllowedTicketTiers =
        new(StringComparer.OrdinalIgnoreCase) { "Basic", "Standard", "Flexible" };

    public List<string> Validate(BookingRequest request)
    {
        var errors = new List<string>();

        if (string.IsNullOrWhiteSpace(request.Email))
        {
            errors.Add("Email is required.");
        }
        else if (!IsValidEmail(request.Email))
        {
            errors.Add("Email must be a valid email address.");
        }

        if (string.IsNullOrWhiteSpace(request.Phone))
        {
            errors.Add("Phone number is required.");
        }
        else if (request.Phone.Trim().Length < 8)
        {
            errors.Add("Phone number must be at least 8 characters.");
        }

        if (string.IsNullOrWhiteSpace(request.Origin) || request.Origin.Trim().Length != 3)
        {
            errors.Add("Origin must be a 3-letter airport code.");
        }

        if (string.IsNullOrWhiteSpace(request.Destination) || request.Destination.Trim().Length != 3)
        {
            errors.Add("Destination must be a 3-letter airport code.");
        }

        if (request.DepartureDate == default)
        {
            errors.Add("Departure date is required.");
        }

        if (string.IsNullOrWhiteSpace(request.OfferId))
        {
            errors.Add("Offer ID is required.");
        }

        if (request.Adults < 1)
        {
            errors.Add("At least one adult passenger is required.");
        }

        if (string.IsNullOrWhiteSpace(request.TicketTier))
        {
            errors.Add("Ticket tier must be Basic, Standard, or Flexible.");
        }
        else
        {
            var normalized = NormalizeTicketTier(request.TicketTier);
            if (!AllowedTicketTiers.Contains(normalized))
            {
                errors.Add("Ticket tier must be Basic, Standard, or Flexible.");
            }
        }

        if (request.TotalAmount <= 0)
        {
            errors.Add("Total amount must be greater than zero.");
        }

        if (string.IsNullOrWhiteSpace(request.Currency))
        {
            errors.Add("Currency is required.");
        }

        if (request.Passengers is null || request.Passengers.Count == 0)
        {
            errors.Add("At least one passenger is required.");
        }
        else
        {
            if (request.Passengers.Count != request.Adults)
            {
                errors.Add("Passenger count must match the number of adults.");
            }

            for (var i = 0; i < request.Passengers.Count; i++)
            {
                errors.AddRange(ValidatePassenger(request.Passengers[i], i + 1));
            }
        }

        errors.AddRange(ValidatePayment(request.Payment));
        errors.AddRange(ValidateBillingAddress(request.BillingAddress));

        return errors;
    }

    public bool IsValid(BookingRequest request) => Validate(request).Count == 0;

    private static string NormalizeTicketTier(string tier)
    {
        var trimmed = tier.Trim();
        if (trimmed.EndsWith(" Ticket", StringComparison.OrdinalIgnoreCase))
        {
            trimmed = trimmed[..^7].Trim();
        }

        return trimmed;
    }

    private static IEnumerable<string> ValidatePassenger(BookingPassengerDto passenger, int index)
    {
        var errors = new List<string>();
        var label = $"Passenger {index}";

        if (string.IsNullOrWhiteSpace(passenger.FirstName))
        {
            errors.Add($"{label}: first name is required.");
        }

        if (string.IsNullOrWhiteSpace(passenger.LastName))
        {
            errors.Add($"{label}: last name is required.");
        }

        if (string.IsNullOrWhiteSpace(passenger.Gender))
        {
            errors.Add($"{label}: gender is required.");
        }

        if (passenger.DateOfBirthDay is < 1 or > 31 ||
            passenger.DateOfBirthMonth is < 1 or > 12 ||
            passenger.DateOfBirthYear < 1900)
        {
            errors.Add($"{label}: date of birth is invalid.");
        }

        return errors;
    }

    private static IEnumerable<string> ValidatePayment(BookingPaymentDto payment)
    {
        var errors = new List<string>();

        if (payment is null)
        {
            errors.Add("Payment details are required.");
            return errors;
        }

        if (!CardLastFourRegex().IsMatch(payment.CardLastFour ?? string.Empty))
        {
            errors.Add("Payment card last four digits are invalid.");
        }

        if (string.IsNullOrWhiteSpace(payment.CardHolderName))
        {
            errors.Add("Card holder name is required.");
        }

        if (!MonthRegex().IsMatch(payment.ExpirationMonth ?? string.Empty))
        {
            errors.Add("Card expiration month is invalid.");
        }

        if (!YearRegex().IsMatch(payment.ExpirationYear ?? string.Empty))
        {
            errors.Add("Card expiration year is invalid.");
        }

        if (string.IsNullOrWhiteSpace(payment.CardBrand))
        {
            errors.Add("Card brand is required.");
        }

        return errors;
    }

    private static IEnumerable<string> ValidateBillingAddress(BookingBillingAddressDto billing)
    {
        var errors = new List<string>();

        if (billing is null)
        {
            errors.Add("Billing address is required.");
            return errors;
        }

        if (string.IsNullOrWhiteSpace(billing.StreetAddress))
        {
            errors.Add("Street address is required.");
        }

        if (string.IsNullOrWhiteSpace(billing.City))
        {
            errors.Add("City is required.");
        }

        if (string.IsNullOrWhiteSpace(billing.State))
        {
            errors.Add("State is required.");
        }

        if (string.IsNullOrWhiteSpace(billing.ZipCode))
        {
            errors.Add("Zip code is required.");
        }

        if (string.IsNullOrWhiteSpace(billing.Country))
        {
            errors.Add("Country is required.");
        }

        return errors;
    }

    private static bool IsValidEmail(string email)
    {
        try
        {
            _ = new MailAddress(email);
            return true;
        }
        catch
        {
            return false;
        }
    }

    [GeneratedRegex(@"^\d{4}$")]
    private static partial Regex CardLastFourRegex();

    [GeneratedRegex(@"^(0[1-9]|1[0-2])$")]
    private static partial Regex MonthRegex();

    [GeneratedRegex(@"^\d{4}$")]
    private static partial Regex YearRegex();
}
