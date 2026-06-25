using Airline.Api.Interfaces;

namespace Airline.Api.Services;

public class ReferenceGeneratorService : IReferenceGeneratorService
{
    private const string Prefix = "FLIGHT";
    private const string Characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    public string GenerateBookingReference()
    {
        var timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
        var random = Random.Shared.Next(100_000, 999_999);
        var combined = timestamp + random;

        var suffix = new char[6];
        for (var i = 5; i >= 0; i--)
        {
            suffix[i] = Characters[(int)(combined % Characters.Length)];
            combined /= Characters.Length;
        }

        return $"{Prefix}-{new string(suffix)}";
    }
}
