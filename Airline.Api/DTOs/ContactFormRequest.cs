namespace Airline.Api.DTOs;

public class ContactFormRequest
{
    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Phone { get; set; } = string.Empty;

    public string Subject { get; set; } = "General Inquiry";

    public string Message { get; set; } = string.Empty;
}
