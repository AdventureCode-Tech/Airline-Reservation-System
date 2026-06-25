using Airline.Api.DTOs;
using Airline.Api.Helpers;
using Airline.Api.Interfaces;
using Airline.Api.Validators;
using Microsoft.AspNetCore.Mvc;

namespace Airline.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FlightsController : ControllerBase
{
    private readonly IFlightService _flightService;
    private readonly FlightSearchValidator _validator;

    public FlightsController(IFlightService flightService, FlightSearchValidator validator)
    {
        _flightService = flightService;
        _validator = validator;
    }

    [HttpPost("search")]
    public async Task<ActionResult<ApiResponse<FlightResults>>> Search(
        [FromBody] FlightSearchRequest request,
        CancellationToken cancellationToken)
    {
        var validationErrors = _validator.Validate(request);
        if (validationErrors.Count > 0)
        {
            return BadRequest(ApiResponse<FlightResults>.FailureResponse(
                validationErrors,
                "Validation failed."));
        }

        var results = await _flightService.SearchFlightsAsync(request, cancellationToken);

        return Ok(ApiResponse<FlightResults>.SuccessResponse(
            results,
            "Flights retrieved successfully."));
    }
}
