using Airline.Api.Configurations;
using Airline.Api.DTOs;
using Airline.Api.Helpers;
using Airline.Api.Interfaces;
using Microsoft.Extensions.Options;

namespace Airline.Api.Services;

public class InquiryService : IInquiryService
{
    private readonly IEmailService _emailService;
    private readonly IInquiryEmailBuilder _emailBuilder;
    private readonly EmailOptions _emailOptions;
    private readonly ILogger<InquiryService> _logger;

    public InquiryService(
        IEmailService emailService,
        IInquiryEmailBuilder emailBuilder,
        IOptions<EmailOptions> emailOptions,
        ILogger<InquiryService> logger)
    {
        _emailService = emailService;
        _emailBuilder = emailBuilder;
        _emailOptions = emailOptions.Value;
        _logger = logger;
    }

    public async Task SubscribeNewsletterAsync(
        NewsletterSubscribeRequest request,
        CancellationToken cancellationToken = default)
    {
        var email = request.Email.Trim();
        var subscribedAt = DateTime.UtcNow;
        var adminEmail = GetNotificationEmail();

        var html = _emailBuilder.BuildNewsletterAdminHtml(email, subscribedAt);
        await TrySendAsync(
            adminEmail,
            $"[Newsletter] New subscriber — {email}",
            html,
            "newsletter",
            cancellationToken);
    }

    public async Task SubmitContactFormAsync(
        ContactFormRequest request,
        CancellationToken cancellationToken = default)
    {
        var submittedAt = DateTime.UtcNow;
        var adminEmail = GetNotificationEmail();
        var fullName = $"{request.FirstName} {request.LastName}".Trim();

        var html = _emailBuilder.BuildContactAdminHtml(request, submittedAt);
        await TrySendAsync(
            adminEmail,
            $"[Contact] {request.Subject} — {fullName}",
            html,
            "contact",
            cancellationToken);
    }

    private string GetNotificationEmail()
    {
        if (string.IsNullOrWhiteSpace(_emailOptions.NotificationEmail))
        {
            throw new InvalidOperationException("Email:NotificationEmail is not configured.");
        }

        return _emailOptions.NotificationEmail.Trim();
    }

    private async Task TrySendAsync(
        string recipientEmail,
        string subject,
        string htmlContent,
        string inquiryType,
        CancellationToken cancellationToken)
    {
        try
        {
            await _emailService.SendHtmlEmail(recipientEmail, subject, htmlContent, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send {InquiryType} notification to {Email}", inquiryType, recipientEmail);
            throw;
        }
    }
}
