using Airline.Api.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Airline.Api.Controllers;

/// <summary>
/// Development-only endpoint to verify SMTP without completing a full booking.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class EmailTestController : ControllerBase
{
    private readonly IEmailService _emailService;
    private readonly IWebHostEnvironment _environment;
    private readonly IConfiguration _configuration;

    public EmailTestController(
        IEmailService emailService,
        IWebHostEnvironment environment,
        IConfiguration configuration)
    {
        _emailService = emailService;
        _environment = environment;
        _configuration = configuration;
    }

    [HttpPost("send")]
    public async Task<IActionResult> SendTestEmail(CancellationToken cancellationToken)
    {
        if (!_environment.IsDevelopment())
        {
            return NotFound();
        }

        var notificationEmail = _configuration["Email:NotificationEmail"]?.Trim();
        if (string.IsNullOrWhiteSpace(notificationEmail))
        {
            return BadRequest(new { message = "Email:NotificationEmail is not configured." });
        }

        var html = """
            <!DOCTYPE html>
            <html>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
              <h1 style="color: #1B1B2F;">MyAdventureCode — Email Test</h1>
              <p>If you received this, your local email configuration is working.</p>
              <p style="color: #D48E15; font-weight: bold;">Next step: complete a test booking to receive the full admin notification.</p>
            </body>
            </html>
            """;

        await _emailService.SendHtmlEmail(
            notificationEmail,
            "MyAdventureCode — Local Email Test",
            html,
            cancellationToken);

        return Ok(new
        {
            message = $"Test email sent to {notificationEmail}. Check your inbox (and spam folder).",
            provider = _configuration["Email:Provider"]
        });
    }
}
