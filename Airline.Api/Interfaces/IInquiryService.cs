using Airline.Api.DTOs;

namespace Airline.Api.Interfaces;

public interface IInquiryService
{
    Task SubscribeNewsletterAsync(NewsletterSubscribeRequest request, CancellationToken cancellationToken = default);

    Task SubmitContactFormAsync(ContactFormRequest request, CancellationToken cancellationToken = default);
}
