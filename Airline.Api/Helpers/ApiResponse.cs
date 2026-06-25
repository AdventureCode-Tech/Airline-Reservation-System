namespace Airline.Api.Helpers;

public class ApiResponse<T>
{
    public bool Success { get; set; }

    public string Message { get; set; } = string.Empty;

    public T? Data { get; set; }

    public List<string> Errors { get; set; } = [];

    public DateTime Timestamp { get; set; }

    public static ApiResponse<T> SuccessResponse(T data, string message = "")
    {
        return new ApiResponse<T>
        {
            Success = true,
            Message = message,
            Data = data,
            Errors = [],
            Timestamp = DateTime.UtcNow
        };
    }

    public static ApiResponse<T> FailureResponse(List<string> errors, string message = "")
    {
        return new ApiResponse<T>
        {
            Success = false,
            Message = message,
            Data = default,
            Errors = errors,
            Timestamp = DateTime.UtcNow
        };
    }
}
