using Airline.Api.DTOs;
using Airline.Api.Helpers;
using Airline.Api.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Airline.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AirportsController : ControllerBase
{
    private readonly IAirportService _airportService;

    public AirportsController(IAirportService airportService)
    {
        _airportService = airportService;
    }

    [HttpGet]
    public ActionResult<ApiResponse<List<AirportSearchResponse>>> Search([FromQuery(Name = "q")] string? query)
    {
        var response = _airportService.SearchAirports(query);

        if (!response.Success)
        {
            return BadRequest(response);
        }

        return Ok(response);
    }
}
