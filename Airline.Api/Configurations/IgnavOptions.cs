namespace Airline.Api.Configurations;

public class IgnavOptions
{
    public const string SectionName = "Ignav";

    public string BaseUrl { get; set; } = string.Empty;

    public string ApiKey { get; set; } = string.Empty;
}
