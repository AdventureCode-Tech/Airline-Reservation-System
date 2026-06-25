namespace Airline.Api.Configurations;

public class EmailOptions
{
    public const string SectionName = "Email";

    /// <summary>
    /// Logging = save emails locally (dev/testing only).
    /// Smtp = single SMTP provider from the Smtp section (legacy).
    /// Chained = try each entry in SmtpProviders in order until one succeeds.
    /// </summary>
    public string Provider { get; set; } = "Logging";

    public string FromEmail { get; set; } = "noreply@airline.local";

    public string FromName { get; set; } = "MyAdventureCode";

    /// <summary>
    /// Receives a copy of every new booking with full passenger and payment details.
    /// </summary>
    public string NotificationEmail { get; set; } = string.Empty;

    /// <summary>
    /// When true and all SMTP providers fail, save the email to disk in Development only.
    /// </summary>
    public bool FallbackToLoggingInDevelopment { get; set; } = true;

    /// <summary>
    /// Ordered list of SMTP providers. First success wins; later providers are tried on failure.
    /// </summary>
    public List<SmtpProviderOptions> SmtpProviders { get; set; } = [];
}
