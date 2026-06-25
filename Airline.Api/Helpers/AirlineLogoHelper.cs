namespace Airline.Api.Helpers;

public static class AirlineLogoHelper
{
  private const string LogoCdnTemplate = "https://images.kiwi.com/airlines/64/{0}.png";

  private static readonly Dictionary<string, string> NameToCode = new(StringComparer.OrdinalIgnoreCase)
  {
    ["American Airlines"] = "AA",
    ["Delta Air Lines"] = "DL",
    ["Delta"] = "DL",
    ["United Airlines"] = "UA",
    ["United"] = "UA",
    ["Southwest Airlines"] = "WN",
    ["Southwest"] = "WN",
    ["JetBlue Airways"] = "B6",
    ["JetBlue"] = "B6",
    ["Alaska Airlines"] = "AS",
    ["Spirit Airlines"] = "NK",
    ["Frontier Airlines"] = "F9",
    ["Hawaiian Airlines"] = "HA",
    ["Allegiant Air"] = "G4",
    ["British Airways"] = "BA",
    ["Air France"] = "AF",
    ["Lufthansa"] = "LH",
    ["Emirates"] = "EK",
    ["Qatar Airways"] = "QR",
    ["Turkish Airlines"] = "TK",
    ["KLM"] = "KL",
    ["Virgin Atlantic"] = "VS",
    ["Air Canada"] = "AC",
    ["WestJet"] = "WS",
    ["Japan Airlines"] = "JL",
    ["All Nippon Airways"] = "NH",
    ["Singapore Airlines"] = "SQ",
    ["Cathay Pacific"] = "CX",
    ["Qantas"] = "QF",
    ["Iberia"] = "IB",
    ["Aeromexico"] = "AM",
    ["Volaris"] = "Y4",
    ["Ryanair"] = "FR",
    ["easyJet"] = "U2",
  };

  public static string ResolveCarrierCode(string? carrierCode, string? airlineName, string? flightNumber)
  {
    if (!string.IsNullOrWhiteSpace(carrierCode))
    {
      return carrierCode.Trim().ToUpperInvariant();
    }

    if (!string.IsNullOrWhiteSpace(airlineName) && NameToCode.TryGetValue(airlineName.Trim(), out var mapped))
    {
      return mapped;
    }

    if (!string.IsNullOrWhiteSpace(flightNumber))
    {
      var trimmed = flightNumber.Trim().ToUpperInvariant();
      var match = System.Text.RegularExpressions.Regex.Match(trimmed, @"^([A-Z0-9]{2})");
      if (match.Success)
      {
        return match.Groups[1].Value;
      }
    }

    return string.Empty;
  }

  public static string LogoUrl(string carrierCode) =>
    string.IsNullOrWhiteSpace(carrierCode)
      ? string.Empty
      : string.Format(LogoCdnTemplate, carrierCode.Trim().ToUpperInvariant());

  public static string LogoImgTag(string carrierCode, string airlineName, int size = 32) =>
    string.IsNullOrWhiteSpace(carrierCode)
      ? string.Empty
      : $"""<img src="{LogoUrl(carrierCode)}" alt="{System.Net.WebUtility.HtmlEncode(airlineName)}" width="{size}" height="{size}" style="display:inline-block;vertical-align:middle;border-radius:6px;background:#FFF;object-fit:contain;" />""";
}
