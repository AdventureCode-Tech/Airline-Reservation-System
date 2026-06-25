namespace Airline.Api.DTOs;

public class BookingPassengerDto
{
    public string Title { get; set; } = string.Empty;

    public string FirstName { get; set; } = string.Empty;

    public string MiddleName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public string Gender { get; set; } = string.Empty;

    public int DateOfBirthDay { get; set; }

    public int DateOfBirthMonth { get; set; }

    public int DateOfBirthYear { get; set; }

    public string? TsaPrecheck { get; set; }
}
