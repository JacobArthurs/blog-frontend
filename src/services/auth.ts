import { apiClient } from './api'
import type { TokenResponse } from '@/types/auth'

export interface LoginCredentials {
  username: string
  password: string
}

const TOKEN_KEY = 'access_token'

export class AuthService {
  async login(credentials: LoginCredentials): Promise<TokenResponse> {
    const response = await apiClient.post<TokenResponse>(
      '/auth/token',
      credentials,
      'application/x-www-form-urlencoded'
    )

    sessionStorage.setItem(TOKEN_KEY, response.access_token)

    return response
  }

  getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY)
  }

  logout(): void {
    sessionStorage.removeItem(TOKEN_KEY)
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }
}

export const authService = new AuthService()
