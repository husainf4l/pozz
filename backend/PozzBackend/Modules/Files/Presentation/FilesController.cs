using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PozzBackend.Common.Application;
using PozzBackend.Modules.Files.Application.DTOs;

namespace PozzBackend.Modules.Files.Presentation;

[ApiController]
[Route("api/files")]
[Authorize]
public class FilesController : ControllerBase
{
    private readonly IStorageService _storage;
    private readonly ILogger<FilesController> _logger;

    // File limits
    private const long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
    private const long MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB (increased from 5MB)

    private static readonly string[] AllowedImageTypes = {
        "image/jpeg", "image/jpg", "image/png", "image/webp",
        "image/gif", "image/svg+xml", "image/heic"
    };

    private static readonly string[] AllowedDocTypes = {
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/csv",
        "text/plain"
    };

    public FilesController(IStorageService storage, ILogger<FilesController> logger)
    {
        _storage = storage;
        _logger = logger;
    }

    [HttpPost("upload")]
    public async Task<IActionResult> Upload(
        IFormFile file,
        [FromQuery] string context = "attachments")
    {
        try
        {
            // Validate file exists
            if (file == null || file.Length == 0)
                return BadRequest(new { error = "No file provided" });

            // Validate file size
            var isImage = file.ContentType.StartsWith("image/");
            var maxSize = isImage ? MAX_IMAGE_SIZE : MAX_FILE_SIZE;

            if (file.Length > maxSize)
            {
                var maxSizeMB = maxSize / (1024 * 1024);
                return BadRequest(new { error = $"File size must be less than {maxSizeMB}MB" });
            }

            // Validate content type
            var allowedTypes = isImage ? AllowedImageTypes : AllowedDocTypes;
            if (!allowedTypes.Contains(file.ContentType.ToLower()))
            {
                return BadRequest(new { error = $"File type '{file.ContentType}' is not allowed" });
            }

            // Determine if file should be public or private based on context
            var publicContexts = new[] { "company-logos", "profile-avatars", "product-images", "project-images" };
            var isPublic = publicContexts.Contains(context);

            _logger.LogInformation(
                "Uploading file: {FileName}, Size: {Size}, Type: {ContentType}, Context: {Context}, Public: {IsPublic}",
                file.FileName, file.Length, file.ContentType, context, isPublic);

            // Upload to S3
            string key;
            using (var stream = file.OpenReadStream())
            {
                key = isPublic
                    ? await _storage.UploadPublicFileAsync(stream, file.FileName, file.ContentType, context)
                    : await _storage.UploadPrivateFileAsync(stream, file.FileName, file.ContentType, context);
            }

            // Get URL
            var url = isPublic
                ? _storage.GetPublicUrl(key)
                : await _storage.GetPresignedUrlAsync(key, 60);

            var response = new FileUploadResponse(
                Key: key,
                OriginalFileName: file.FileName,
                ContentType: file.ContentType,
                SizeBytes: file.Length,
                Context: context,
                IsPublic: isPublic,
                Url: url
            );

            _logger.LogInformation("Successfully uploaded file: {Key}", key);

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to upload file");
            return StatusCode(500, new { error = "Failed to upload file", detail = ex.Message });
        }
    }

    [HttpDelete("{key}")]
    public async Task<IActionResult> Delete(string key)
    {
        try
        {
            await _storage.DeleteFileAsync(key);
            _logger.LogInformation("Successfully deleted file: {Key}", key);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to delete file: {Key}", key);
            return StatusCode(500, new { error = "Failed to delete file" });
        }
    }
}
