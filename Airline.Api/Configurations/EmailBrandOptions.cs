namespace Airline.Api.Configurations;

public class EmailBrandOptions
{
    public const string SectionName = "Email:Brand";

    public string SiteName { get; set; } = "MyAdventureCode";

    public string Tagline { get; set; } = "Your Trusted Travel Partner";

    public string SupportEmail { get; set; } = "support@myadventurecode.com";

    public string SupportPhone { get; set; } = "(801) 477-4474";

    public string Address { get; set; } = "486 NJ-10, Randolph, NJ 07869, United States";

    public string LogoFileName { get; set; } = "logo.png";
}
