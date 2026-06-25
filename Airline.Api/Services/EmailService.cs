using Airline.Api.Configurations;
using Airline.Api.Interfaces;
using MailKit.Security;
using Microsoft.Extensions.Options;

namespace Airline.Api.Services;

public class EmailService : IEmailService
{
    private readonly EmailOptions _options;
    private readonly SmtpOptions _legacySmtpOptions;
    private readonly LoggingEmailService _loggingEmailService;
    private readonly SmtpEmailSender _smtpEmailSender;
    private readonly IWebHostEnvironment _environment;
    private readonly ILogger<EmailService> _logger;

    public EmailService(
        IOptions<EmailOptions> options,
        IOptions<SmtpOptions> smtpOptions,
        LoggingEmailService loggingEmailService,
        SmtpEmailSender smtpEmailSender,
        IWebHostEnvironment environment,
        ILogger<EmailService> logger)
    {
        _options = options.Value;
        _legacySmtpOptions = smtpOptions.Value;
        _loggingEmailService = loggingEmailService;
        _smtpEmailSender = smtpEmailSender;
        _environment = environment;
        _logger = logger;
    }

    public async Task SendHtmlEmail(
        string recipientEmail,
        string subject,
        string htmlContent,
        CancellationToken cancellationToken = default)
    {
        var providerMode = _options.Provider.Trim();

        if (providerMode.Equals("Logging", StringComparison.OrdinalIgnoreCase))
        {
            await _loggingEmailService.SendHtmlEmail(
                recipientEmail, subject, htmlContent, cancellationToken);
            return;
        }

        if (providerMode.Equals("Smtp", StringComparison.OrdinalIgnoreCase))
        {
            await SendViaSingleProviderAsync(
                ToProviderOptions(_legacySmtpOptions, "Smtp"),
                recipientEmail,
                subject,
                htmlContent,
                cancellationToken);
            return;
        }

        if (providerMode.Equals("Chained", StringComparison.OrdinalIgnoreCase))
        {
            await SendViaChainedProvidersAsync(
                recipientEmail,
                subject,
                htmlContent,
                cancellationToken);
            return;
        }

        throw new InvalidOperationException(
            $"Unknown Email:Provider \"{_options.Provider}\". Use Logging, Smtp, or Chained.");
    }

    private async Task SendViaChainedProvidersAsync(
        string recipientEmail,
        string subject,
        string htmlContent,
        CancellationToken cancellationToken)
    {
        var providers = ResolveProviders();

        if (providers.Count == 0)
        {
            throw new InvalidOperationException(
                "Email:Provider is Chained but no SMTP providers are configured. " +
                "Add Email:SmtpProviders or Smtp settings, or use Provider=Logging for local dev.");
        }

        var errors = new List<Exception>();

        foreach (var provider in providers)
        {
            if (!provider.IsConfigured)
            {
                _logger.LogWarning(
                    "Skipping SMTP provider \"{ProviderName}\" because it is not configured.",
                    provider.Name);
                continue;
            }

            try
            {
                await SendViaSingleProviderAsync(
                    provider,
                    recipientEmail,
                    subject,
                    htmlContent,
                    cancellationToken);
                return;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(
                    ex,
                    "SMTP provider \"{ProviderName}\" failed for {Email}. Trying next provider.",
                    provider.Name,
                    recipientEmail);
                errors.Add(ex);
            }
        }

        if (_environment.IsDevelopment() && _options.FallbackToLoggingInDevelopment)
        {
            _logger.LogWarning(
                "All SMTP providers failed for {Email}. Saving email locally (development fallback).",
                recipientEmail);
            await _loggingEmailService.SendHtmlEmail(
                recipientEmail, subject, htmlContent, cancellationToken);
            return;
        }

        throw new AggregateException(
            $"All SMTP providers failed to send email to {recipientEmail}.",
            errors);
    }

    private async Task SendViaSingleProviderAsync(
        SmtpProviderOptions provider,
        string recipientEmail,
        string subject,
        string htmlContent,
        CancellationToken cancellationToken)
    {
        try
        {
            await _smtpEmailSender.SendHtmlEmailAsync(
                provider,
                _options.FromName,
                _options.FromEmail,
                recipientEmail,
                subject,
                htmlContent,
                cancellationToken);
        }
        catch (AuthenticationException ex)
        {
            _logger.LogError(ex, "SMTP authentication failed for provider {ProviderName}", provider.Name);
            throw new InvalidOperationException(
                $"SMTP authentication failed for provider \"{provider.Name}\".",
                ex);
        }
    }

    private List<SmtpProviderOptions> ResolveProviders()
    {
        if (_options.SmtpProviders.Count > 0)
        {
            return _options.SmtpProviders;
        }

        if (_legacySmtpOptions is { Host: not null and not "" })
        {
            return [ToProviderOptions(_legacySmtpOptions, "Smtp")];
        }

        return [];
    }

    private static SmtpProviderOptions ToProviderOptions(SmtpOptions smtp, string name) =>
        new()
        {
            Name = name,
            Host = smtp.Host,
            Port = smtp.Port,
            Username = smtp.Username,
            Password = smtp.Password
        };
}
