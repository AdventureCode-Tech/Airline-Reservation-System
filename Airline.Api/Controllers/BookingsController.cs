using Airline.Api.DTOs;
using Airline.Api.Helpers;
using Airline.Api.Interfaces;
using Airline.Api.Validators;
using Microsoft.AspNetCore.Mvc;

namespace Airline.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookingsController : ControllerBase
{
    private readonly IBookingService _bookingService;
    private readonly BookingRequestValidator _validator;

    public BookingsController(
        IBookingService bookingService,
        BookingRequestValidator validator)
    {
        _bookingService = bookingService;
        _validator = validator;
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<BookingResponse>>> Create(
        [FromBody] BookingRequest request,
        CancellationToken cancellationToken)
    {
        var validationErrors = _validator.Validate(request);
        if (validationErrors.Count > 0)
        {
            return BadRequest(ApiResponse<BookingResponse>.FailureResponse(
                validationErrors,
                "Validation failed."));
        }

        var result = await _bookingService.CreateBookingAsync(request, cancellationToken);

        return Ok(ApiResponse<BookingResponse>.SuccessResponse(
            result,
            "Booking created successfully."));
    }
}
