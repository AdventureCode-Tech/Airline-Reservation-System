namespace Airline.Api.Interfaces;

public interface IEmailService
{
    Task SendHtmlEmail(
        string recipientEmail,
        string subject,
        string htmlContent,
        CancellationToken cancellationToken = default);
}
