using Airline.Api.Configurations;
using Airline.Api.Interfaces;
using Microsoft.Extensions.Options;

namespace Airline.Api.Services;

public class LoggingEmailService : IEmailService
{
    private readonly EmailOptions _options;
    private readonly IWebHostEnvironment _environment;
    private readonly ILogger<LoggingEmailService> _logger;

    public LoggingEmailService(
        IOptions<EmailOptions> options,
        IWebHostEnvironment environment,
        ILogger<LoggingEmailService> logger)
    {
        _options = options.Value;
        _environment = environment;
        _logger = logger;
    }

    public async Task SendHtmlEmail(
        string recipientEmail,
        string subject,
        string htmlContent,
        CancellationToken cancellationToken = default)
    {
        var outputDirectory = Path.Combine(_environment.ContentRootPath, "Emails");
        Directory.CreateDirectory(outputDirectory);

        var safeRecipient = string.Concat(recipientEmail.Split(Path.GetInvalidFileNameChars()));
        var safeSubject = string.Concat(subject.Split(Path.GetInvalidFileNameChars())).Replace(' ', '_');
        var fileName = $"{DateTime.UtcNow:yyyyMMddHHmmssfff}_{safeSubject}_{safeRecipient}.html";
        var filePath = Path.Combine(outputDirectory, fileName);

        var envelope = $"""
            <!-- DEV EMAIL (not sent via SMTP) -->
            <!-- To: {recipientEmail} -->
            <!-- From: {_options.FromName} <{_options.FromEmail}> -->
            <!-- Subject: {subject} -->
            <!-- Saved: {DateTime.UtcNow:O} -->

            {htmlContent}
            """;

        await File.WriteAllTextAsync(filePath, envelope, cancellationToken);

        _logger.LogInformation(
            "Email captured for {Email} ({Subject}). Open {FilePath} to review.",
            recipientEmail,
            subject,
            filePath);
    }
}
