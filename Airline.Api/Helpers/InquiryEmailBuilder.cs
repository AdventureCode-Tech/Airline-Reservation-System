using System.Net;
using System.Text;
using Airline.Api.DTOs;
using Airline.Api.Services;

namespace Airline.Api.Helpers;

public interface IInquiryEmailBuilder
{
    string BuildNewsletterAdminHtml(string subscriberEmail, DateTime subscribedAtUtc);

    string BuildContactAdminHtml(ContactFormRequest request, DateTime submittedAtUtc);
}

public class InquiryEmailBuilder : IInquiryEmailBuilder
{
    private const string Navy = "#1B1B2F";
    private const string Gold = "#D48E15";
    private const string Slate500 = "#64748B";
    private const string Slate900 = "#0F172A";

    private readonly IEmailBrandProvider _brandProvider;

    public InquiryEmailBuilder(IEmailBrandProvider brandProvider)
    {
        _brandProvider = brandProvider;
    }

    public string BuildNewsletterAdminHtml(string subscriberEmail, DateTime subscribedAtUtc)
    {
        var body = AdminBanner("Newsletter Sign-up", subscribedAtUtc);
        body += HighlightBlock(
            "Subscriber Email",
            $"""<a href="mailto:{Encode(subscriberEmail)}" style="color:{Navy};font-size:18px;font-weight:700;text-decoration:none;">{Encode(subscriberEmail)}</a>""");
        body += Note("This person subscribed via the website footer newsletter form.");
        return Wrap("New Newsletter Subscriber", body);
    }

    public string BuildContactAdminHtml(ContactFormRequest request, DateTime submittedAtUtc)
    {
        var fullName = $"{request.FirstName} {request.LastName}".Trim();
        var body = AdminBanner("Contact Form Message", submittedAtUtc);
        body += QuickRow([
            ("From", Encode(fullName)),
            ("Subject", Encode(request.Subject)),
            ("Email", $"""<a href="mailto:{Encode(request.Email)}" style="color:{Navy};font-weight:700;text-decoration:none;">{Encode(request.Email)}</a>"""),
            ("Phone", Encode(request.Phone))
        ]);
        body += Section("Message", $"""<p style="margin:0;font-size:15px;line-height:1.7;color:{Slate900};white-space:pre-wrap;">{Encode(request.Message.Trim())}</p>""");
        body += Note("Reply directly to the customer's email address above.");
        return Wrap("New Contact Form Submission", body);
    }

    private string AdminBanner(string title, DateTime atUtc)
    {
        var brand = _brandProvider.Brand;
        var logo = LogoImg(44);

        return $"""
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:{Navy};border-bottom:4px solid {Gold};">
              <tr><td style="padding:22px 28px;">
                <table role="presentation" width="100%"><tr>
                  <td style="vertical-align:middle;">
                    <table role="presentation"><tr>
                      <td style="padding-right:12px;vertical-align:middle;">{logo}</td>
                      <td style="vertical-align:middle;">
                        <p style="margin:0;font-size:18px;font-weight:700;color:#FFF;">{Encode(brand.SiteName)}</p>
                        <p style="margin:4px 0 0;font-size:12px;color:#CBD5E1;">{Encode(title)} · {atUtc:MMM d, yyyy h:mm tt} UTC</p>
                      </td>
                    </tr></table>
                  </td>
                  <td style="text-align:right;vertical-align:middle;">
                    <span style="display:inline-block;background:{Gold};color:#FFF;font-size:10px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;padding:8px 14px;border-radius:6px;">Admin Alert</span>
                  </td>
                </tr></table>
              </td></tr>
            </table>
            """;
    }

    private static string QuickRow(IEnumerable<(string Label, string Value)> cells)
    {
        var rows = new StringBuilder();
        foreach (var (label, value) in cells)
        {
            rows.Append($"""
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #E2E8F0;width:30%;color:{Slate500};font-size:13px;vertical-align:top;">{Encode(label)}</td>
                  <td style="padding:10px 0;border-bottom:1px solid #E2E8F0;font-weight:700;color:{Slate900};font-size:14px;vertical-align:top;">{value}</td>
                </tr>
                """);
        }

        return $"""<table role="presentation" width="100%" style="margin:0 28px 16px;border:1px solid #E2E8F0;border-radius:8px;background:#FFF;"><tr><td style="padding:20px 24px;"><table role="presentation" width="100%">{rows}</table></td></tr></table>""";
    }

    private static string HighlightBlock(string label, string value) =>
        $"""
        <table role="presentation" width="100%" style="margin:0 28px 16px;border:1px solid #E2E8F0;border-left:4px solid {Gold};border-radius:8px;background:#FFF;">
          <tr><td style="padding:20px 24px;">
            <p style="margin:0 0 8px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:{Slate500};">{Encode(label)}</p>
            {value}
          </td></tr>
        </table>
        """;

    private static string Section(string title, string inner) =>
        $"""
        <p style="margin:0 28px 10px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;color:{Gold};">{Encode(title)}</p>
        <table role="presentation" width="100%" style="margin:0 28px 16px;border:1px solid #E2E8F0;border-radius:8px;background:#FFF;">
          <tr><td style="padding:20px 24px;">{inner}</td></tr>
        </table>
        """;

    private static string Note(string text) =>
        $"""<p style="margin:0 28px 28px;font-size:12px;color:{Slate500};">{Encode(text)}</p>""";

    private string LogoImg(int size)
    {
        var uri = _brandProvider.LogoDataUri;
        if (string.IsNullOrEmpty(uri))
        {
            return $"""<div style="width:{size}px;height:{size}px;background:#FFF;border-radius:8px;"></div>""";
        }

        return $"""<img src="{uri}" alt="{Encode(_brandProvider.Brand.SiteName)}" width="{size}" height="{size}" style="display:block;border-radius:8px;background:#FFF;padding:3px;" />""";
    }

    private string Wrap(string title, string body) =>
        $"""
        <!DOCTYPE html>
        <html lang="en"><head><meta charset="utf-8" /><title>{Encode(title)}</title></head>
        <body style="margin:0;padding:24px 12px;background:#F1F5F9;font-family:Arial,Helvetica,sans-serif;">
          <table role="presentation" width="100%"><tr><td align="center">
            <table role="presentation" width="600" style="max-width:600px;width:100%;background:#FFF;border-radius:4px;box-shadow:0 4px 20px rgba(27,27,47,0.08);">
              <tr><td style="word-break:break-word;">{body}</td></tr>
            </table>
          </td></tr></table>
        </body></html>
        """;

    private static string Encode(string? value) => WebUtility.HtmlEncode(value ?? string.Empty);
}
