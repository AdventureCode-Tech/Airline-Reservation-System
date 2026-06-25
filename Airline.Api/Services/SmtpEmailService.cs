using Airline.Api.Configurations;
using Airline.Api.Interfaces;
using Microsoft.Extensions.Options;

namespace Airline.Api.Services;

/// <summary>
/// Legacy single-provider wrapper. Prefer <see cref="EmailService"/> with Provider=Chained.
/// </summary>
public class SmtpEmailService : IEmailService
{
    private readonly EmailOptions _emailOptions;
    private readonly SmtpOptions _smtpOptions;
    private readonly SmtpEmailSender _smtpEmailSender;

    public SmtpEmailService(
        IOptions<EmailOptions> emailOptions,
        IOptions<SmtpOptions> smtpOptions,
        SmtpEmailSender smtpEmailSender)
    {
        _emailOptions = emailOptions.Value;
        _smtpOptions = smtpOptions.Value;
        _smtpEmailSender = smtpEmailSender;
    }

    public Task SendHtmlEmail(
        string recipientEmail,
        string subject,
        string htmlContent,
        CancellationToken cancellationToken = default)
    {
        var provider = new SmtpProviderOptions
        {
            Name = "Smtp",
            Host = _smtpOptions.Host,
            Port = _smtpOptions.Port,
            Username = _smtpOptions.Username,
            Password = _smtpOptions.Password
        };

        return _smtpEmailSender.SendHtmlEmailAsync(
            provider,
            _emailOptions.FromName,
            _emailOptions.FromEmail,
            recipientEmail,
            subject,
            htmlContent,
            cancellationToken);
    }
}
