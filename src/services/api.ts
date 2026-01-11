const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`

    const token = sessionStorage.getItem('access_token')

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options?.headers
      }
    }

    const response = await fetch(url, config)

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null)
      throw {
        message: 'An error occurred',
        statusCode: response.status,
        ...errorBody
      }
    }

    const contentType = response.headers.get('content-type')
    if (response.status === 204 || !contentType?.includes('application/json')) {
      return {} as T
    }

    return response.json()
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(
    endpoint: string,
    data: unknown,
    contentType:
      | 'application/json'
      | 'application/x-www-form-urlencoded' = 'application/json'
  ): Promise<T> {
    const body =
      contentType === 'application/x-www-form-urlencoded'
        ? new URLSearchParams(data as Record<string, string>).toString()
        : JSON.stringify(data)

    return this.request<T>(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': contentType
      },
      body
    })
  }

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

export const apiClient = new ApiClient()
