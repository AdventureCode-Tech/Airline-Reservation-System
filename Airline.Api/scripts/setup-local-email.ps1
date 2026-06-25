# Configure Gmail SMTP for local email testing (Airline.Api user secrets).
# Run from repo root or Airline.Api folder after creating a Gmail App Password:
# https://myaccount.google.com/apppasswords

param(
    [Parameter(Mandatory = $true)]
    [string]$GmailAddress,

    [Parameter(Mandatory = $true)]
    [string]$AppPassword
)

$projectPath = Join-Path $PSScriptRoot "Airline.Api.csproj"
if (-not (Test-Path $projectPath)) {
    Write-Error "Run this script from the Airline.Api directory."
    exit 1
}

dotnet user-secrets set "Email:Provider" "Chained" --project $projectPath
dotnet user-secrets set "Email:NotificationEmail" $GmailAddress --project $projectPath
dotnet user-secrets set "Email:FromEmail" $GmailAddress --project $projectPath
dotnet user-secrets set "Email:SmtpProviders:0:Name" "Gmail" --project $projectPath
dotnet user-secrets set "Email:SmtpProviders:0:Host" "smtp.gmail.com" --project $projectPath
dotnet user-secrets set "Email:SmtpProviders:0:Port" "587" --project $projectPath
dotnet user-secrets set "Email:SmtpProviders:0:Username" "ganarm2003@gmail.com" --project $projectPath
dotnet user-secrets set "Email:SmtpProviders:0:Password" "yvpb elqe hpfd pxqg" --project $projectPath

Write-Host ""
Write-Host "Gmail SMTP configured in user secrets." -ForegroundColor Green
Write-Host "1. Restart Airline.Api (dotnet run)"
Write-Host "2. Test: curl -X POST http://localhost:5168/api/emailtest/send"
Write-Host "3. Complete a booking — admin email goes to $GmailAddress"
