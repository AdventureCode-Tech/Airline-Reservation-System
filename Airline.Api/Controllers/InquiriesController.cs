using Airline.Api.DTOs;
using Airline.Api.Helpers;
using Airline.Api.Interfaces;
using Airline.Api.Validators;
using Microsoft.AspNetCore.Mvc;

namespace Airline.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InquiriesController : ControllerBase
{
    private readonly IInquiryService _inquiryService;
    private readonly NewsletterSubscribeValidator _newsletterValidator;
    private readonly ContactFormValidator _contactValidator;

    public InquiriesController(
        IInquiryService inquiryService,
        NewsletterSubscribeValidator newsletterValidator,
        ContactFormValidator contactValidator)
    {
        _inquiryService = inquiryService;
        _newsletterValidator = newsletterValidator;
        _contactValidator = contactValidator;
    }

    [HttpPost("newsletter")]
    public async Task<ActionResult<ApiResponse<object>>> SubscribeNewsletter(
        [FromBody] NewsletterSubscribeRequest request,
        CancellationToken cancellationToken)
    {
        var errors = _newsletterValidator.Validate(request);
        if (errors.Count > 0)
        {
            return BadRequest(ApiResponse<object>.FailureResponse(errors, "Validation failed."));
        }

        await _inquiryService.SubscribeNewsletterAsync(request, cancellationToken);

        return Ok(ApiResponse<object>.SuccessResponse(
            new { subscribed = true },
            "Thank you for subscribing to our newsletter."));
    }

    [HttpPost("contact")]
    public async Task<ActionResult<ApiResponse<object>>> SubmitContact(
        [FromBody] ContactFormRequest request,
        CancellationToken cancellationToken)
    {
        var errors = _contactValidator.Validate(request);
        if (errors.Count > 0)
        {
            return BadRequest(ApiResponse<object>.FailureResponse(errors, "Validation failed."));
        }

        await _inquiryService.SubmitContactFormAsync(request, cancellationToken);

        return Ok(ApiResponse<object>.SuccessResponse(
            new { submitted = true },
            "Your message has been sent. We will get back to you within 24 hours."));
    }
}
