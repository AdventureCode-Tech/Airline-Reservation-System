namespace Airline.Api.Helpers;

public static class CardBrandLogoHelper
{
  public static string LogoImgTag(string? cardBrand, int height = 24) =>
    cardBrand?.Trim().ToLowerInvariant() switch
    {
      "visa" => VisaSvg(height),
      "mastercard" => MastercardSvg(height),
      "amex" or "american express" => AmexSvg(height),
      "discover" => DiscoverSvg(height),
      _ => string.Empty
    };

  private static string VisaSvg(int height)
  {
    var width = (int)(height * 2.5);
    return $"""<img src="https://cdn.jsdelivr.net/npm/payment-icons@1.1.0/min/flat/visa.svg" alt="Visa" width="{width}" height="{height}" style="display:inline-block;vertical-align:middle;" />""";
  }

  private static string MastercardSvg(int height)
  {
    var width = (int)(height * 2.5);
    return $"""<img src="https://cdn.jsdelivr.net/npm/payment-icons@1.1.0/min/flat/mastercard.svg" alt="Mastercard" width="{width}" height="{height}" style="display:inline-block;vertical-align:middle;" />""";
  }

  private static string AmexSvg(int height)
  {
    var width = (int)(height * 2.5);
    return $"""<img src="https://cdn.jsdelivr.net/npm/payment-icons@1.1.0/min/flat/amex.svg" alt="American Express" width="{width}" height="{height}" style="display:inline-block;vertical-align:middle;" />""";
  }

  private static string DiscoverSvg(int height)
  {
    var width = (int)(height * 2.5);
    return $"""<img src="https://cdn.jsdelivr.net/npm/payment-icons@1.1.0/min/flat/discover.svg" alt="Discover" width="{width}" height="{height}" style="display:inline-block;vertical-align:middle;" />""";
  }
}
