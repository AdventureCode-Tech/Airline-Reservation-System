using Airline.Api.Configurations;
using Microsoft.Extensions.Options;

namespace Airline.Api.Services;

public interface IEmailBrandProvider
{
    string LogoDataUri { get; }

    EmailBrandOptions Brand { get; }
}

public class EmailBrandProvider : IEmailBrandProvider
{
    public EmailBrandProvider(
        IWebHostEnvironment environment,
        IOptions<EmailBrandOptions> brandOptions)
    {
        Brand = brandOptions.Value;
        LogoDataUri = LoadLogoDataUri(environment, Brand.LogoFileName);
    }

    public string LogoDataUri { get; }

    public EmailBrandOptions Brand { get; }

    private static string LoadLogoDataUri(IWebHostEnvironment environment, string fileName)
    {
        var logoPath = Path.Combine(environment.ContentRootPath, "Assets", fileName);
        if (!File.Exists(logoPath))
        {
            return string.Empty;
        }

        var bytes = File.ReadAllBytes(logoPath);
        return $"data:image/png;base64,{Convert.ToBase64String(bytes)}";
    }
}
