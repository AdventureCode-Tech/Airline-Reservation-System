using System.Net.Mail;
using Airline.Api.DTOs;

namespace Airline.Api.Validators;

public class ContactFormValidator
{
    private static readonly HashSet<string> AllowedSubjects =
        new(StringComparer.OrdinalIgnoreCase)
        {
            "General Inquiry",
            "Flight Booking",
            "Hotel Booking",
            "Vacation Package",
            "Support",
            "Other"
        };

    public List<string> Validate(ContactFormRequest request)
    {
        var errors = new List<string>();

        if (string.IsNullOrWhiteSpace(request.FirstName))
        {
            errors.Add("First name is required.");
        }

        if (string.IsNullOrWhiteSpace(request.LastName))
        {
            errors.Add("Last name is required.");
        }

        if (string.IsNullOrWhiteSpace(request.Email))
        {
            errors.Add("Email is required.");
        }
        else if (!IsValidEmail(request.Email.Trim()))
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

        if (string.IsNullOrWhiteSpace(request.Subject))
        {
            errors.Add("Subject is required.");
        }
        else if (!AllowedSubjects.Contains(request.Subject.Trim()))
        {
            errors.Add("Subject is invalid.");
        }

        if (string.IsNullOrWhiteSpace(request.Message))
        {
            errors.Add("Message is required.");
        }
        else if (request.Message.Trim().Length < 10)
        {
            errors.Add("Message must be at least 10 characters.");
        }

        return errors;
    }

    public bool IsValid(ContactFormRequest request) => Validate(request).Count == 0;

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
}
