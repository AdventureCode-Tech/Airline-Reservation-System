namespace Airline.Api.Validators;

public class AirportSearchValidator
{
    public List<string> Validate(string? query)
    {
        var errors = new List<string>();

        if (string.IsNullOrWhiteSpace(query))
        {
            errors.Add("Query is required.");
            return errors;
        }

        if (query.Trim().Length < 3)
        {
            errors.Add("Query must be at least 3 characters long.");
        }

        return errors;
    }

    public bool IsValid(string? query) => Validate(query).Count == 0;
}
