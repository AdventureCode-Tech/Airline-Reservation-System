using Airline.Api.Configurations;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace Airline.Api.Services;

/// <summary>
/// Low-level SMTP send helper used by single-provider and chained email services.
/// </summary>
public class SmtpEmailSender
{
    private readonly ILogger<SmtpEmailSender> _logger;

    public SmtpEmailSender(ILogger<SmtpEmailSender> logger)
    {
        _logger = logger;
    }

    public async Task SendHtmlEmailAsync(
        SmtpProviderOptions provider,
        string fromName,
        string fromEmail,
        string recipientEmail,
        string subject,
        string htmlContent,
        CancellationToken cancellationToken = default)
    {
        if (!provider.IsConfigured)
        {
            throw new InvalidOperationException(
                $"SMTP provider \"{provider.Name}\" is not fully configured.");
        }

        var username = provider.Username.Trim();
        var password = provider.Password.Trim();

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(fromName, fromEmail.Trim()));
        message.To.Add(MailboxAddress.Parse(recipientEmail));
        message.Subject = subject;
        message.Body = new TextPart("html") { Text = htmlContent };

        using var client = new SmtpClient();

        _logger.LogInformation(
            "Sending email to {Email} via {Provider} ({Host}:{Port})",
            recipientEmail,
            provider.Name,
            provider.Host,
            provider.Port);

        var socketOptions = provider.Port switch
        {
            465 => SecureSocketOptions.SslOnConnect,
            _ => SecureSocketOptions.StartTls
        };

        await client.ConnectAsync(provider.Host, provider.Port, socketOptions, cancellationToken);
        await client.AuthenticateAsync(username, password, cancellationToken);
        await client.SendAsync(message, cancellationToken);
        await client.DisconnectAsync(true, cancellationToken);

        _logger.LogInformation(
            "Email sent to {Email} via {Provider}",
            recipientEmail,
            provider.Name);
    }
}
