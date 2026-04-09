/**
 * API Client
 * Handles all HTTP requests with authentication, error handling, and retries
 */

import { API_BASE_URL, REQUEST_TIMEOUT, RETRY_CONFIG, STORAGE_KEYS } from './config'

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

interface RequestOptions extends RequestInit {
  timeout?: number
  retries?: number
}

class ApiClient {
  private baseURL: string

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
  }

  /**
   * Get the authentication token from storage
   */
  private getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(STORAGE_KEYS.accessToken)
  }

  /**
   * Build headers for the request
   */
  private buildHeaders(customHeaders?: HeadersInit): Headers {
    const headers = new Headers(customHeaders)
    
    // Add content type if not set
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }
    
    // Add authorization token if available
    const token = this.getToken()
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    
    return headers
  }

  /**
   * Make an HTTP request with timeout and retry logic
   */
  private async makeRequest<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const {
      timeout = REQUEST_TIMEOUT,
      retries = RETRY_CONFIG.maxRetries,
      headers: customHeaders,
      ...fetchOptions
    } = options

    const url = `${this.baseURL}${endpoint}`
    const headers = this.buildHeaders(customHeaders)

    let lastError: Error | null = null

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), timeout)

        const response = await fetch(url, {
          ...fetchOptions,
          headers,
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        // Handle different response statuses
        if (response.status === 401) {
          // Unauthorized - clear token and redirect to login
          if (typeof window !== 'undefined') {
            localStorage.removeItem(STORAGE_KEYS.accessToken)
            localStorage.removeItem(STORAGE_KEYS.refreshToken)
            localStorage.removeItem(STORAGE_KEYS.user)
            window.location.href = '/login'
          }
          throw new ApiError('Unauthorized', 401)
        }

        if (response.status === 404) {
          throw new ApiError('Resource not found', 404)
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new ApiError(
            errorData.message || 'Request failed',
            response.status,
            errorData
          )
        }

        // Handle empty responses (204 No Content)
        if (response.status === 204) {
          return {} as T
        }

        const data = await response.json()
        return data as T

      } catch (error) {
        lastError = error as Error

        // Don't retry on certain errors
        if (
          error instanceof ApiError &&
          (error.status === 401 || error.status === 404)
        ) {
          throw error
        }

        // Don't retry on the last attempt
        if (attempt === retries) {
          break
        }

        // Wait before retrying
        await new Promise(resolve =>
          setTimeout(resolve, RETRY_CONFIG.retryDelay * (attempt + 1))
        )
      }
    }

    throw lastError || new ApiError('Request failed after retries')
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: 'GET',
    })
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: 'DELETE',
    })
  }

  /**
   * Upload file
   */
  async upload<T>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, any>
  ): Promise<T> {
    const formData = new FormData()
    formData.append('file', file)

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value)
      })
    }

    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type, let browser set it with boundary
        Authorization: `Bearer ${this.getToken()}`,
      } as any,
    })
  }
}

// Export singleton instance
export const apiClient = new ApiClient()
