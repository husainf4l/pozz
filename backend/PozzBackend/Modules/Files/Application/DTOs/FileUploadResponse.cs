namespace PozzBackend.Modules.Files.Application.DTOs;

public record FileUploadResponse(
    string Key,
    string OriginalFileName,
    string ContentType,
    long SizeBytes,
    string Context,
    bool IsPublic,
    string Url
);
