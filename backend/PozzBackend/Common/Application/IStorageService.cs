namespace PozzBackend.Common.Application;

public interface IStorageService
{
    /// <summary>Upload to public/ prefix — served via CloudFront CDN permanently.</summary>
    Task<string> UploadPublicFileAsync(Stream fileStream, string fileName, string contentType, string context);

    /// <summary>Upload to private/ prefix — only accessible via backend presigned URL proxy.</summary>
    Task<string> UploadPrivateFileAsync(Stream fileStream, string fileName, string contentType, string context);

    /// <summary>Delete a file from S3.</summary>
    Task DeleteFileAsync(string key);

    /// <summary>Get permanent CDN URL for public files. No AWS call needed.</summary>
    string GetPublicUrl(string key);

    /// <summary>Get presigned URL for private files (short-lived).</summary>
    Task<string> GetPresignedUrlAsync(string key, int expiryMinutes = 60);
}
