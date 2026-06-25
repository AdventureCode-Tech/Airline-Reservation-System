using System.Net.Mail;
using Airline.Api.DTOs;

namespace Airline.Api.Validators;

public class NewsletterSubscribeValidator
{
    public List<string> Validate(NewsletterSubscribeRequest request)
    {
        var errors = new List<string>();

        if (string.IsNullOrWhiteSpace(request.Email))
        {
            errors.Add("Email is required.");
        }
        else if (!IsValidEmail(request.Email.Trim()))
        {
            errors.Add("Email must be a valid email address.");
        }

        return errors;
    }

    public bool IsValid(NewsletterSubscribeRequest request) => Validate(request).Count == 0;

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
