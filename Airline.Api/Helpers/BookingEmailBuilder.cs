using System.Globalization;
using System.Net;
using System.Text;
using Airline.Api.Configurations;
using Airline.Api.DTOs;
using Airline.Api.Interfaces;
using Airline.Api.Services;

namespace Airline.Api.Helpers;

public class BookingEmailBuilder : IBookingEmailBuilder
{
    private const string Navy = "#1B1B2F";
    private const string Gold = "#D48E15";
    private const string GoldDark = "#92400E";
    private const string AmberBg = "#FFFBEB";
    private const string Slate50 = "#F8FAFC";
    private const string Slate200 = "#E2E8F0";
    private const string Slate500 = "#64748B";
    private const string Slate700 = "#334155";
    private const string Slate900 = "#0F172A";

    private readonly IEmailBrandProvider _brandProvider;

    public BookingEmailBuilder(IEmailBrandProvider brandProvider)
    {
        _brandProvider = brandProvider;
    }

    public string BuildCustomerConfirmationHtml(
        BookingRequest request,
        string bookingReference,
        string status,
        DateTime bookedAtUtc)
    {
        var brand = _brandProvider.Brand;
        var issued = FormatIssuedDate(bookedAtUtc);
        var tripType = ResolveTripType(request);
        var tierLabel = DisplayTicketTier(request.TicketTier);

        var body = new StringBuilder();
        body.Append(DocumentHeader("Flight Confirmation", issued, customer: true));
        body.Append(ConfirmationBar(bookingReference, status));
        body.Append(SectionHeading("Trip Summary"));
        body.Append(GridCard([
            GridCell("Trip Type", tripType),
            GridCell("Route", $"{Encode(request.Origin)} → {Encode(request.Destination)}"),
            GridCell("Departure", request.DepartureDate.ToString("MMMM d, yyyy", CultureInfo.InvariantCulture)),
            request.ReturnDate.HasValue
                ? GridCell("Return", request.ReturnDate.Value.ToString("MMMM d, yyyy", CultureInfo.InvariantCulture))
                : string.Empty,
            GridCell("Cabin Class", FormatCabinClass(request.CabinClass)),
            GridCell("Ticket Tier", tierLabel),
            GridCell("Travelers", $"{request.Adults} Adult{(request.Adults == 1 ? "" : "s")}")
        ]));
        body.Append(SectionHeading("Passenger Details"));
        body.Append(CustomerPassengerTable(request));
        body.Append(FlightSections(request, customer: true));
        body.Append(SectionHeading("Fare Summary"));
        body.Append(FareSummaryTable(request, tierLabel));
        body.Append(SectionHeading("Payment & Contact"));
        body.Append(TwoColumnCard(
            $"""
            <p style="margin:0 0 12px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:{Gold};">Payment</p>
            <p style="margin:0 0 8px;font-size:14px;color:{Slate700};"><span style="color:{Slate500};font-size:12px;display:block;">Card</span>{CardBrandPaymentLine(request.Payment.CardBrand, request.Payment.CardLastFour)}</p>
            <p style="margin:0;font-size:14px;color:{Slate700};"><span style="color:{Slate500};font-size:12px;display:block;">Card Holder</span>{Encode(request.Payment.CardHolderName)}</p>
            """,
            $"""
            <p style="margin:0 0 12px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:{Gold};">Contact</p>
            <p style="margin:0 0 8px;font-size:14px;color:{Slate700};"><span style="color:{Slate500};font-size:12px;display:block;">Email</span>{Encode(request.Email)}</p>
            <p style="margin:0;font-size:14px;color:{Slate700};"><span style="color:{Slate500};font-size:12px;display:block;">Phone</span>{Encode(request.Phone)}</p>
            """));
        body.Append(CustomerNotice(status, brand));

        return WrapDocument(
            $"Your flight confirmation — {bookingReference}",
            body.ToString());
    }

    public string BuildAdminNotificationHtml(
        BookingRequest request,
        string bookingReference,
        string status,
        DateTime bookedAtUtc)
    {
        var brand = _brandProvider.Brand;
        var issued = FormatIssuedDate(bookedAtUtc);
        var tripType = ResolveTripType(request);
        var tierLabel = DisplayTicketTier(request.TicketTier);
        var primary = request.Passengers.FirstOrDefault();
        var primaryName = primary is null
            ? "Traveler"
            : $"{primary.Title} {primary.FirstName} {primary.LastName}".Trim();

        var body = new StringBuilder();
        body.Append(AdminTopBanner(issued));
        body.Append(AdminQuickStrip(request, bookingReference, status, tripType, primaryName));
        body.Append(SectionHeading("Customer Contact", admin: true));
        body.Append(HighlightCard(
            $"""
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
              <td style="padding:8px 16px 8px 0;vertical-align:top;width:50%;">
                <p style="margin:0 0 4px;font-size:11px;font-weight:700;text-transform:uppercase;color:{Slate500};">Email</p>
                <p style="margin:0;font-size:16px;font-weight:700;"><a href="mailto:{Encode(request.Email)}" style="color:{Navy};text-decoration:none;">{Encode(request.Email)}</a></p>
              </td>
              <td style="padding:8px 0 8px 16px;vertical-align:top;width:50%;">
                <p style="margin:0 0 4px;font-size:11px;font-weight:700;text-transform:uppercase;color:{Slate500};">Phone</p>
                <p style="margin:0;font-size:16px;font-weight:700;color:{Navy};">{Encode(request.Phone)}</p>
              </td>
            </tr></table>
            """));
        body.Append(SectionHeading("Trip Overview", admin: true));
        body.Append(GridCard([
            GridCell("Confirmation #", $"<span style=\"font-family:monospace;font-size:15px;\">{Encode(bookingReference)}</span>"),
            GridCell("Status", AdminStatusPill(status)),
            GridCell("Trip", tripType),
            GridCell("Route", $"{Encode(request.Origin)} → {Encode(request.Destination)}"),
            GridCell("Departure", request.DepartureDate.ToString("MMM d, yyyy", CultureInfo.InvariantCulture)),
            GridCell("Return", request.ReturnDate?.ToString("MMM d, yyyy", CultureInfo.InvariantCulture) ?? "—"),
            GridCell("Cabin", FormatCabinClass(request.CabinClass)),
            GridCell("Offer ID", Encode(request.OfferId))
        ]));
        body.Append(SectionHeading("Passengers — Full Details", admin: true));
        body.Append(AdminPassengerTable(request));
        body.Append(FlightSections(request, customer: false));
        body.Append(SectionHeading("Add-ons & Pricing", admin: true));
        body.Append(AdminPricingCard(request, tierLabel));
        body.Append(SectionHeading("Payment", admin: true));
        body.Append(HighlightCard(
            $"""
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              {DataRow("Card", CardBrandPaymentLine(request.Payment.CardBrand, request.Payment.CardLastFour))}
              {DataRow("Expires", $"{Encode(request.Payment.ExpirationMonth)}/{Encode(request.Payment.ExpirationYear)}")}
              {DataRow("Card Holder", Encode(request.Payment.CardHolderName))}
            </table>
            """));
        body.Append(SectionHeading("Billing Address", admin: true));
        body.Append(HighlightCard(BillingBlock(request)));
        body.Append(AdminActionFooter(status, brand));

        return WrapDocument(
            $"New booking {bookingReference} — review required",
            body.ToString());
    }

    private string DocumentHeader(string docTitle, string issued, bool customer)
    {
        var brand = _brandProvider.Brand;
        var logo = LogoImg(56);

        return $"""
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:{Navy};border-bottom:4px solid {Gold};">
              <tr>
                <td style="padding:28px 32px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="vertical-align:middle;">
                        <table role="presentation" cellpadding="0" cellspacing="0"><tr>
                          <td style="vertical-align:middle;padding-right:16px;">{logo}</td>
                          <td style="vertical-align:middle;">
                            <p style="margin:0;font-size:22px;font-weight:700;color:#FFFFFF;">{Encode(brand.SiteName)}</p>
                            <p style="margin:4px 0 0;font-size:13px;color:#CBD5E1;">{Encode(brand.Tagline)}</p>
                          </td>
                        </tr></table>
                      </td>
                      <td style="vertical-align:middle;text-align:right;">
                        <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:{Gold};">{Encode(docTitle)}</p>
                        <p style="margin:6px 0 0;font-size:13px;color:#CBD5E1;">Issued {issued}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            """;
    }

    private string AdminTopBanner(string issued)
    {
        var brand = _brandProvider.Brand;
        var logo = LogoImg(48);

        return $"""
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:{Navy};border-bottom:4px solid {Gold};">
              <tr>
                <td style="padding:24px 32px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
                    <td style="vertical-align:middle;">
                      <table role="presentation" cellpadding="0" cellspacing="0"><tr>
                        <td style="padding-right:14px;vertical-align:middle;">{logo}</td>
                        <td style="vertical-align:middle;">
                          <p style="margin:0;font-size:20px;font-weight:700;color:#FFF;">{Encode(brand.SiteName)}</p>
                          <p style="margin:4px 0 0;font-size:12px;color:#CBD5E1;">Admin booking alert · {issued}</p>
                        </td>
                      </tr></table>
                    </td>
                    <td style="vertical-align:middle;text-align:right;">
                      <span style="display:inline-block;background:{Gold};color:#FFF;font-size:11px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;padding:10px 16px;border-radius:6px;">New Booking</span>
                    </td>
                  </tr></table>
                </td>
              </tr>
            </table>
            """;
    }

    private string ConfirmationBar(string bookingReference, string status) =>
        $"""
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:{Slate50};border-bottom:1px solid {Slate200};">
          <tr>
            <td style="padding:20px 32px;width:50%;vertical-align:top;">
              <p style="margin:0 0 6px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:{Slate500};">Confirmation Number</p>
              <p style="margin:0;font-family:monospace;font-size:26px;font-weight:800;color:{Navy};">{Encode(bookingReference)}</p>
            </td>
            <td style="padding:20px 32px;width:50%;vertical-align:top;text-align:right;">
              <p style="margin:0 0 6px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:{Slate500};">Booking Status</p>
              {StatusPill(status)}
            </td>
          </tr>
        </table>
        """;

    private string AdminQuickStrip(
        BookingRequest request,
        string bookingReference,
        string status,
        string tripType,
        string primaryName) =>
        $"""
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FFF;border-bottom:1px solid {Slate200};">
          <tr>
            {QuickMetric("Reference", $"<span style=\"font-family:monospace;\">{Encode(bookingReference)}</span>")}
            {QuickMetric("Total", $"<span style=\"color:{Gold};font-size:18px;\">{FormatMoney(request.Currency, request.TotalAmount)}</span>")}
            {QuickMetric("Route", $"{Encode(request.Origin)} → {Encode(request.Destination)}")}
            {QuickMetric("Primary Pax", Encode(primaryName))}
          </tr>
          <tr>
            {QuickMetric("Status", AdminStatusPill(status))}
            {QuickMetric("Trip", tripType)}
            {QuickMetric("Travelers", request.Adults.ToString())}
            {QuickMetric("Tier", DisplayTicketTier(request.TicketTier))}
          </tr>
        </table>
        """;

    private static string QuickMetric(string label, string value) =>
        $"""
        <td style="padding:16px 20px;border-right:1px solid {Slate200};border-bottom:1px solid {Slate200};vertical-align:top;width:25%;">
          <p style="margin:0 0 4px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:{Slate500};">{label}</p>
          <p style="margin:0;font-size:14px;font-weight:700;color:{Slate900};">{value}</p>
        </td>
        """;

    private string SectionHeading(string title, bool admin = false)
    {
        var padding = admin ? "24px 32px 12px" : "24px 32px 12px";
        return $"""<p style="margin:0;padding:{padding};font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.12em;color:{Gold};">{Encode(title)}</p>""";
    }

    private static string GridCell(string label, string value) =>
        $"""
        <td style="padding:12px 16px;width:50%;vertical-align:top;border-bottom:1px solid {Slate200};">
          <p style="margin:0 0 4px;font-size:11px;color:{Slate500};">{Encode(label)}</p>
          <p style="margin:0;font-size:14px;font-weight:700;color:{Slate900};">{value}</p>
        </td>
        """;

    private static string GridCard(IEnumerable<string> cells)
    {
        var rows = new StringBuilder();
        var list = cells.Where(c => !string.IsNullOrEmpty(c)).ToList();
        for (var i = 0; i < list.Count; i += 2)
        {
            var left = list[i];
            var right = i + 1 < list.Count ? list[i + 1] : $"""<td style="padding:12px 16px;width:50%;border-bottom:1px solid {Slate200};"></td>""";
            rows.Append($"<tr>{left}{right}</tr>");
        }

        return $"""
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 32px 8px;border:1px solid {Slate200};border-radius:8px;background:#FFF;">
          {rows}
        </table>
        """;
    }

    private static string CustomerPassengerTable(BookingRequest request)
    {
        var rows = new StringBuilder();
        for (var i = 0; i < request.Passengers.Count; i++)
        {
            var p = request.Passengers[i];
            var name = string.Join(" ", new[] { p.Title, p.FirstName, p.MiddleName, p.LastName }
                .Where(s => !string.IsNullOrWhiteSpace(s)));
            rows.Append($"""
                <tr style="border-top:1px solid {Slate200};">
                  <td style="padding:12px 16px;color:{Slate500};width:40px;">{i + 1}</td>
                  <td style="padding:12px 16px;font-weight:600;color:{Slate900};">{Encode(name)}</td>
                  <td style="padding:12px 16px;color:{Slate700};">Adult</td>
                </tr>
                """);
        }

        return $"""
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 32px 16px;border:1px solid {Slate200};border-radius:8px;background:#FFF;">
          <tr style="background:{Slate50};">
            <th style="padding:10px 16px;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;color:{Slate500};">#</th>
            <th style="padding:10px 16px;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;color:{Slate500};">Passenger Name</th>
            <th style="padding:10px 16px;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;color:{Slate500};">Type</th>
          </tr>
          {rows}
        </table>
        """;
    }

    private static string AdminPassengerTable(BookingRequest request)
    {
        var rows = new StringBuilder();
        for (var i = 0; i < request.Passengers.Count; i++)
        {
            var p = request.Passengers[i];
            var name = string.Join(" ", new[] { p.Title, p.FirstName, p.MiddleName, p.LastName }
                .Where(s => !string.IsNullOrWhiteSpace(s)));
            var dob = $"{p.DateOfBirthYear:0000}-{p.DateOfBirthMonth:00}-{p.DateOfBirthDay:00}";
            var tsa = string.IsNullOrWhiteSpace(p.TsaPrecheck) ? "—" : Encode(p.TsaPrecheck);
            rows.Append($"""
                <tr style="border-top:1px solid {Slate200};">
                  <td style="padding:10px 12px;color:{Slate500};">{i + 1}</td>
                  <td style="padding:10px 12px;font-weight:700;color:{Slate900};">{Encode(name)}</td>
                  <td style="padding:10px 12px;color:{Slate700};">{Encode(p.Gender)}</td>
                  <td style="padding:10px 12px;color:{Slate700};font-family:monospace;font-size:13px;">{dob}</td>
                  <td style="padding:10px 12px;color:{Slate700};">{tsa}</td>
                </tr>
                """);
        }

        return $"""
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 32px 16px;border:1px solid {Slate200};border-radius:8px;background:#FFF;font-size:13px;table-layout:fixed;width:calc(100% - 64px);">
          <tr style="background:{Navy};color:#FFF;">
            <th style="padding:10px 8px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;width:28px;">#</th>
            <th style="padding:10px 8px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;">Name</th>
            <th style="padding:10px 8px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;width:60px;">Gender</th>
            <th style="padding:10px 8px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;width:90px;">DOB</th>
            <th style="padding:10px 8px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;width:70px;">TSA</th>
          </tr>
          {rows}
        </table>
        """;
    }

    private string FlightSections(BookingRequest request, bool customer)
    {
        if (request.OutboundSegments.Count == 0 && request.ReturnSegments.Count == 0)
        {
            return string.Empty;
        }

        var sb = new StringBuilder();
        var outboundTitle = request.ReturnSegments.Count > 0 ? "Departure Flight" : "Flight Details";
        sb.Append(SectionHeading(outboundTitle, admin: !customer));
        sb.Append(SegmentCards(request.OutboundSegments));
        if (request.OutboundSegments.Count > 0)
        {
            sb.Append(SegmentFooter(request.OutboundSegments));
        }

        if (request.ReturnSegments.Count > 0)
        {
            sb.Append(SectionHeading("Return Flight", admin: !customer));
            sb.Append(SegmentCards(request.ReturnSegments));
            sb.Append(SegmentFooter(request.ReturnSegments));
        }

        return sb.ToString();
    }

    private static string SegmentCards(List<BookingFlightSegmentDto> segments)
    {
        var sb = new StringBuilder();
        foreach (var segment in segments)
        {
            var dep = FormatSegmentDateTime(segment.DepartureTime);
            var arr = FormatSegmentDateTime(segment.ArrivalTime);
            var carrierCode = AirlineLogoHelper.ResolveCarrierCode(segment.CarrierCode, segment.Airline, segment.FlightNumber);
            var airlineLogo = AirlineLogoHelper.LogoImgTag(carrierCode, segment.Airline, 36);
            sb.Append($"""
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 32px 12px;border:1px solid {Slate200};border-radius:8px;background:#FFF;">
                  <tr>
                    <td style="padding:16px 20px;border-bottom:1px solid {Slate200};">
                      <table role="presentation" width="100%"><tr>
                        <td style="vertical-align:middle;">
                          <table role="presentation" cellpadding="0" cellspacing="0"><tr>
                            <td style="padding-right:12px;vertical-align:middle;">{airlineLogo}</td>
                            <td style="vertical-align:middle;">
                              <p style="margin:0;font-weight:700;color:{Slate900};word-break:break-word;">{Encode(segment.Airline)}</p>
                              <p style="margin:4px 0 0;font-size:12px;color:{Slate500};">Flight {Encode(segment.FlightNumber)}</p>
                            </td>
                          </tr></table>
                        </td>
                        <td style="text-align:right;vertical-align:middle;"><p style="margin:0;font-size:12px;font-weight:700;color:{Gold};">{FormatDuration(segment.DurationMinutes)}</p></td>
                      </tr></table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:16px 20px;">
                      <table role="presentation" width="100%"><tr>
                        <td style="width:50%;vertical-align:top;">
                          <p style="margin:0 0 4px;font-size:10px;text-transform:uppercase;color:{Slate500};">Departure</p>
                          <p style="margin:0 0 4px;font-size:18px;font-weight:800;color:{Slate900};">{dep.Time}</p>
                          <p style="margin:0 0 2px;font-size:14px;font-weight:600;color:{Slate700};">{Encode(segment.Origin)}</p>
                          <p style="margin:0;font-size:12px;color:{Slate500};">{dep.Date}</p>
                        </td>
                        <td style="width:50%;vertical-align:top;text-align:right;">
                          <p style="margin:0 0 4px;font-size:10px;text-transform:uppercase;color:{Slate500};">Arrival</p>
                          <p style="margin:0 0 4px;font-size:18px;font-weight:800;color:{Slate900};">{arr.Time}</p>
                          <p style="margin:0 0 2px;font-size:14px;font-weight:600;color:{Slate700};">{Encode(segment.Destination)}</p>
                          <p style="margin:0;font-size:12px;color:{Slate500};">{arr.Date}</p>
                        </td>
                      </tr></table>
                    </td>
                  </tr>
                </table>
                """);
        }

        return sb.ToString();
    }

    private static string SegmentFooter(List<BookingFlightSegmentDto> segments)
    {
        var total = segments.Sum(s => s.DurationMinutes);
        var stops = segments.Count <= 1 ? "Nonstop" : $"{segments.Count - 1} stop{(segments.Count - 1 == 1 ? "" : "s")}";
        return $"""<p style="margin:0 32px 20px;font-size:12px;color:{Slate500};">Total travel time: {FormatDuration(total)} · {stops}</p>""";
    }

    private static string FareSummaryTable(BookingRequest request, string tierLabel)
    {
        var baseFare = request.BasePricePerAdult * request.Adults;
        var rows = new StringBuilder();
        rows.Append(FareRow($"Base fare ({request.Adults} × {FormatMoney(request.Currency, request.BasePricePerAdult)})", FormatMoney(request.Currency, baseFare)));

        if (request.TicketTierAddon > 0)
        {
            rows.Append(FareRow(tierLabel, FormatMoney(request.Currency, request.TicketTierAddon)));
        }

        if (request.WebCheckIn)
        {
            rows.Append(FareRow("Web Check-In", FormatMoney(request.Currency, request.WebCheckInPrice)));
        }

        if (request.CancellationProtection)
        {
            rows.Append(FareRow("Cancellation Protection", FormatMoney(request.Currency, request.CancellationProtectionPrice)));
        }

        return $"""
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 32px 16px;border:1px solid {Slate200};border-radius:8px;background:#FFF;">
          {rows}
          <tr style="background:{Navy};">
            <td style="padding:16px 20px;font-size:16px;font-weight:700;color:#FFF;">Total Amount</td>
            <td style="padding:16px 20px;text-align:right;font-size:22px;font-weight:800;color:{Gold};">{FormatMoney(request.Currency, request.TotalAmount)}</td>
          </tr>
        </table>
        <p style="margin:0 32px 16px;font-size:11px;color:{Slate500};">Includes taxes and surcharges where applicable.</p>
        """;
    }

    private static string AdminPricingCard(BookingRequest request, string tierLabel)
    {
        var baseFare = request.BasePricePerAdult * request.Adults;
        var sb = new StringBuilder();
        sb.Append(DataRow("Ticket tier", tierLabel));
        sb.Append(DataRow("Base fare", $"{FormatMoney(request.Currency, request.BasePricePerAdult)} × {request.Adults} = {FormatMoney(request.Currency, baseFare)}"));
        sb.Append(DataRow("Tier add-on", FormatMoney(request.Currency, request.TicketTierAddon)));
        sb.Append(DataRow("Web check-in", request.WebCheckIn ? $"Yes — {FormatMoney(request.Currency, request.WebCheckInPrice)}" : "No"));
        sb.Append(DataRow("Cancellation protection", request.CancellationProtection
            ? $"Yes — {FormatMoney(request.Currency, request.CancellationProtectionPrice)}"
            : "No"));
        sb.Append($"""
            <tr><td colspan="2" style="padding:14px 0 0;border-top:2px solid {Slate200};">
              <table role="presentation" width="100%"><tr>
                <td style="font-size:15px;font-weight:800;color:{Navy};">Total charged</td>
                <td style="text-align:right;font-size:20px;font-weight:800;color:{Gold};">{FormatMoney(request.Currency, request.TotalAmount)}</td>
              </tr></table>
            </td></tr>
            """);

        return HighlightCard($"""<table role="presentation" width="100%" cellpadding="0" cellspacing="0">{sb}</table>""");
    }

    private static string FareRow(string label, string amount) =>
        $"""
        <tr style="border-bottom:1px solid {Slate200};">
          <td style="padding:12px 20px;color:{Slate700};">{label}</td>
          <td style="padding:12px 20px;text-align:right;font-weight:600;color:{Slate900};">{amount}</td>
        </tr>
        """;

    private static string TwoColumnCard(string left, string right) =>
        $"""
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 32px 16px;border:1px solid {Slate200};border-radius:8px;background:#FFF;">
          <tr>
            <td style="padding:20px;width:50%;vertical-align:top;border-right:1px solid {Slate200};">{left}</td>
            <td style="padding:20px;width:50%;vertical-align:top;">{right}</td>
          </tr>
        </table>
        """;

    private static string HighlightCard(string inner) =>
        $"""<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 32px 16px;border:1px solid {Slate200};border-left:4px solid {Gold};border-radius:8px;background:#FFF;"><tr><td style="padding:20px 24px;">{inner}</td></tr></table>""";

    private static string DataRow(string label, string value) =>
        $"""
        <tr>
          <td style="padding:8px 0;color:{Slate500};font-size:13px;width:42%;vertical-align:top;">{Encode(label)}</td>
          <td style="padding:8px 0;font-weight:700;color:{Slate900};font-size:14px;vertical-align:top;">{value}</td>
        </tr>
        """;

    private string CustomerNotice(string status, EmailBrandOptions brand) =>
        $"""
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 32px 32px;border:1px solid #FDE68A;background:{AmberBg};border-radius:8px;">
          <tr><td style="padding:20px 24px;">
            <p style="margin:0 0 8px;font-weight:700;color:{GoldDark};">Important Notice</p>
            <p style="margin:0;font-size:14px;line-height:1.6;color:#78350F;">
              Your booking is currently <strong>{Encode(status)}</strong>. Our travel team is confirming your reservation with the airline.
              You will receive a final confirmation email once complete. Please retain this confirmation number for all inquiries.
            </p>
          </td></tr>
        </table>
        <p style="margin:0 32px 32px;font-size:12px;color:{Slate500};text-align:center;">
          {Encode(brand.SiteName)} · {Encode(brand.Address)}<br />
          Support: {Encode(brand.SupportPhone)} · <a href="mailto:{Encode(brand.SupportEmail)}" style="color:{Gold};">{Encode(brand.SupportEmail)}</a>
        </p>
        """;

    private static string AdminActionFooter(string status, EmailBrandOptions brand) =>
        $"""
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 32px 32px;background:{Navy};border-radius:8px;">
          <tr><td style="padding:24px;">
            <p style="margin:0 0 8px;font-size:12px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:{Gold};">Action required</p>
            <p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#E2E8F0;">
              Review this booking and confirm with the airline. Status is <strong style="color:#FFF;">{Encode(status)}</strong> until you complete processing.
            </p>
            <p style="margin:0;font-size:12px;color:#94A3B8;">
              PCI note: full card number and CVV are never stored. Only last 4 digits and expiry are included above.
            </p>
          </td></tr>
        </table>
        <p style="margin:0 32px 32px;font-size:11px;color:{Slate500};text-align:center;">{Encode(brand.SiteName)} admin notification · automated booking alert</p>
        """;

    private static string BillingBlock(BookingRequest request)
    {
        var apt = string.IsNullOrWhiteSpace(request.BillingAddress.AptSuite)
            ? string.Empty
            : $"{Encode(request.BillingAddress.AptSuite)}<br />";

        return $"""
        <p style="margin:0;font-size:14px;line-height:1.7;color:{Slate900};">
          {Encode(request.BillingAddress.StreetAddress)}<br />
          {apt}
          {Encode(request.BillingAddress.City)}, {Encode(request.BillingAddress.State)} {Encode(request.BillingAddress.ZipCode)}<br />
          {Encode(request.BillingAddress.Country)}
        </p>
        """;
    }

    private string LogoImg(int size)
    {
        var uri = _brandProvider.LogoDataUri;
        if (string.IsNullOrEmpty(uri))
        {
            return $"""<div style="width:{size}px;height:{size}px;background:#FFF;border-radius:8px;display:inline-block;"></div>""";
        }

        return $"""<img src="{uri}" alt="{Encode(_brandProvider.Brand.SiteName)}" width="{size}" height="{size}" style="display:block;border-radius:8px;background:#FFF;padding:4px;" />""";
    }

    private static string StatusPill(string status) =>
        $"""<span style="display:inline-block;background:#FEF3C7;color:#92400E;font-size:13px;font-weight:800;text-transform:uppercase;padding:8px 16px;border-radius:999px;border:1px solid #FDE68A;">{Encode(status)}</span>""";

    private static string AdminStatusPill(string status) =>
        $"""<span style="display:inline-block;background:#FEF3C7;color:#92400E;font-size:12px;font-weight:800;text-transform:uppercase;padding:6px 12px;border-radius:999px;">{Encode(status)}</span>""";

    private string WrapDocument(string title, string body) =>
        $"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>{Encode(title)}</title>
        </head>
        <body style="margin:0;padding:24px 12px;background:#F1F5F9;font-family:Arial,Helvetica,sans-serif;color:{Slate900};">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
            <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;background:#FFFFFF;border-radius:4px;box-shadow:0 4px 24px rgba(27,27,47,0.08);">
              <tr><td style="word-break:break-word;">{body}</td></tr>
            </table>
          </td></tr></table>
        </body>
        </html>
        """;

    private static string ResolveTripType(BookingRequest request)
    {
        if (!string.IsNullOrWhiteSpace(request.TripType))
        {
            return request.TripType.Trim() switch
            {
                "RoundTrip" => "Round Trip",
                "OneWay" => "One Way",
                _ => request.TripType
            };
        }

        return request.ReturnDate.HasValue ? "Round Trip" : "One Way";
    }

    private static string DisplayTicketTier(string tier)
    {
        var normalized = tier.Trim();
        if (normalized.EndsWith(" Ticket", StringComparison.OrdinalIgnoreCase))
        {
            return normalized;
        }

        return normalized switch
        {
            "Basic" => "Basic Ticket",
            "Standard" => "Standard Ticket",
            "Flexible" => "Flexible Ticket",
            _ => normalized
        };
    }

    private static string FormatCabinClass(string cabin) =>
        cabin switch
        {
            "PremiumEconomy" => "Premium Economy",
            "Business" => "Business",
            "First" => "First",
            _ => "Economy"
        };

    private static (string Time, string Date) FormatSegmentDateTime(string iso)
    {
        if (DateTime.TryParseExact(
                iso,
                "yyyy-MM-dd'T'HH:mm:ss",
                CultureInfo.InvariantCulture,
                DateTimeStyles.None,
                out var local))
        {
            return (
                local.ToString("hh:mm tt", CultureInfo.InvariantCulture),
                local.ToString("ddd, MMM d, yyyy", CultureInfo.InvariantCulture));
        }

        if (DateTimeOffset.TryParse(iso, CultureInfo.InvariantCulture, DateTimeStyles.AssumeUniversal, out var dto))
        {
            return (
                dto.ToString("hh:mm tt", CultureInfo.InvariantCulture),
                dto.ToString("ddd, MMM d, yyyy", CultureInfo.InvariantCulture));
        }

        return (Encode(iso), string.Empty);
    }

    private static string FormatDuration(int minutes)
    {
        if (minutes <= 0) return "—";
        var h = minutes / 60;
        var m = minutes % 60;
        return h > 0 ? $"{h}h {m}m" : $"{m}m";
    }

    private static string FormatIssuedDate(DateTime utc) =>
        utc.ToString("MMM d, yyyy h:mm tt 'UTC'", CultureInfo.InvariantCulture);

    private static string FormatMoney(string currency, decimal amount) =>
        $"{Encode(currency)} {amount:0.00}";

    private static string Encode(string? value) => WebUtility.HtmlEncode(value ?? string.Empty);

    private static string CardBrandPaymentLine(string cardBrand, string lastFour)
    {
        var logo = CardBrandLogoHelper.LogoImgTag(cardBrand, 22);
        var brandText = WebUtility.HtmlEncode(cardBrand);
        var last = WebUtility.HtmlEncode(lastFour);
        return string.IsNullOrEmpty(logo)
            ? $"{brandText} ending in {last}"
            : $"""<span style="display:inline-flex;align-items:center;gap:8px;">{logo}<span>{brandText} ending in {last}</span></span>""";
    }
}
