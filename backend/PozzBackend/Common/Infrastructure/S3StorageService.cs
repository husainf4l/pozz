using Amazon.S3;
using Amazon.S3.Model;
using PozzBackend.Common.Application;

namespace PozzBackend.Common.Infrastructure;

public class S3StorageService : IStorageService
{
    private readonly IAmazonS3 _s3;
    private readonly string _bucketName;
    private readonly string _cdnBaseUrl;
    private readonly ILogger<S3StorageService> _logger;

    public S3StorageService(
        IAmazonS3 s3,
        IConfiguration configuration,
        ILogger<S3StorageService> logger)
    {
        _s3 = s3;
        _bucketName = configuration["Storage:BucketName"] 
            ?? throw new InvalidOperationException("Storage:BucketName not configured");
        _cdnBaseUrl = (configuration["Storage:CdnBaseUrl"] ?? "").TrimEnd('/');
        _logger = logger;
    }

    public async Task<string> UploadPublicFileAsync(Stream fileStream, string fileName, string contentType, string context)
    {
        return await UploadAsync(fileStream, fileName, contentType, $"public/pozz/{context}");
    }

    public async Task<string> UploadPrivateFileAsync(Stream fileStream, string fileName, string contentType, string context)
    {
        return await UploadAsync(fileStream, fileName, contentType, $"private/pozz/{context}");
    }

    private async Task<string> UploadAsync(Stream stream, string fileName, string contentType, string prefix)
    {
        var extension = Path.GetExtension(fileName).ToLowerInvariant();
        var key = $"{prefix}/{Guid.NewGuid()}{extension}";

        try
        {
            await _s3.PutObjectAsync(new PutObjectRequest
            {
                BucketName = _bucketName,
                Key = key,
                InputStream = stream,
                ContentType = contentType
            });

            _logger.LogInformation("Successfully uploaded file to S3: {Key}", key);
            return key;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to upload file to S3: {Key}", key);
            throw;
        }
    }

    public string GetPublicUrl(string key)
    {
        if (key.StartsWith("http://") || key.StartsWith("https://"))
            return key;

        if (!string.IsNullOrEmpty(_cdnBaseUrl))
            return $"{_cdnBaseUrl}/{key}";

        // Fallback to direct S3 URL if no CDN configured
        return $"https://{_bucketName}.s3.amazonaws.com/{key}";
    }

    public async Task<string> GetPresignedUrlAsync(string key, int expiryMinutes = 60)
    {
        try
        {
            var request = new GetPreSignedUrlRequest
            {
                BucketName = _bucketName,
                Key = key,
                Expires = DateTime.UtcNow.AddMinutes(expiryMinutes),
                Protocol = Protocol.HTTPS
            };

            var url = await Task.FromResult(_s3.GetPreSignedURL(request));
            _logger.LogInformation("Generated presigned URL for: {Key}", key);
            return url;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to generate presigned URL for: {Key}", key);
            throw;
        }
    }

    public async Task DeleteFileAsync(string key)
    {
        try
        {
            // Handle full URLs by extracting the key
            if (key.StartsWith("http"))
            {
                var uri = new Uri(key);
                key = uri.AbsolutePath.TrimStart('/');
            }

            await _s3.DeleteObjectAsync(_bucketName, key);
            _logger.LogInformation("Successfully deleted file from S3: {Key}", key);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to delete file from S3: {Key}", key);
            throw;
        }
    }
}
