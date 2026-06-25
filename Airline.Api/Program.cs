using Airline.Api.Configurations;
using Airline.Api.Constants;
using Airline.Api.Helpers;
using Airline.Api.Interfaces;
using Airline.Api.Middleware;
using Airline.Api.Services;
using Airline.Api.Validators;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<IgnavOptions>(
    builder.Configuration.GetSection(IgnavOptions.SectionName));

builder.Services.Configure<EmailOptions>(
    builder.Configuration.GetSection(EmailOptions.SectionName));

builder.Services.Configure<SmtpOptions>(
    builder.Configuration.GetSection(SmtpOptions.SectionName));

builder.Services.AddHttpClient(IgnavConstants.HttpClientName, (serviceProvider, client) =>
{
    var options = serviceProvider.GetRequiredService<IOptions<IgnavOptions>>().Value;

    if (!string.IsNullOrWhiteSpace(options.BaseUrl))
    {
        client.BaseAddress = new Uri(options.BaseUrl);
    }
});

// Add services to the container.

builder.Services.AddScoped<FlightSearchValidator>();
builder.Services.AddScoped<BookingRequestValidator>();
builder.Services.AddScoped<IIgnavService, IgnavService>();
builder.Services.AddScoped<IFlightService, FlightService>();
builder.Services.AddScoped<AirportSearchValidator>();
builder.Services.AddScoped<IAirportService, AirportService>();
builder.Services.AddScoped<NewsletterSubscribeValidator>();
builder.Services.AddScoped<ContactFormValidator>();
builder.Services.AddScoped<IInquiryEmailBuilder, InquiryEmailBuilder>();
builder.Services.AddScoped<IInquiryService, InquiryService>();
builder.Services.AddScoped<IBookingService, BookingService>();
builder.Services.Configure<EmailBrandOptions>(
    builder.Configuration.GetSection(EmailBrandOptions.SectionName));

builder.Services.AddSingleton<IEmailBrandProvider, EmailBrandProvider>();
builder.Services.AddScoped<IBookingEmailBuilder, BookingEmailBuilder>();
builder.Services.AddScoped<SmtpEmailSender>();
builder.Services.AddScoped<LoggingEmailService>();
builder.Services.AddScoped<SmtpEmailService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IReferenceGeneratorService, ReferenceGeneratorService>();

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod());
});

var app = builder.Build();

app.UseMiddleware<ExceptionHandlingMiddleware>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseCors();

app.UseAuthorization();

app.MapControllers();

app.Run();
