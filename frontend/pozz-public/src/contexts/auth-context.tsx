"use client"

/**
 * Authentication Context
 * Manages user authentication state and provides auth methods
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api/client'
import { API_ENDPOINTS, STORAGE_KEYS } from '@/lib/api/config'
import type { User, AuthResponse } from '@/lib/types/api'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (data: SignupData) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

interface SignupData {
  name: string
  email: string
  password: string
  company?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Load user from storage on mount
  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      const storedUser = localStorage.getItem(STORAGE_KEYS.user)
      const token = localStorage.getItem(STORAGE_KEYS.accessToken)

      if (storedUser && token) {
        setUser(JSON.parse(storedUser))
        
        // Validate token by fetching current user
        try {
          const response = await apiClient.get<{ data: User }>(API_ENDPOINTS.auth.me)
          setUser(response.data)
          localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(response.data))
        } catch (error) {
          // Token invalid, clear storage
          clearAuth()
        }
      }
    } catch (error) {
      console.error('Failed to load user:', error)
      clearAuth()
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post<AuthResponse>(
        API_ENDPOINTS.auth.login,
        { email, password }
      )

      // Store tokens and user
      localStorage.setItem(STORAGE_KEYS.accessToken, response.accessToken)
      localStorage.setItem(STORAGE_KEYS.refreshToken, response.refreshToken)
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(response.user))
      
      setUser(response.user)
      router.push('/dashboard')
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const signup = async (data: SignupData) => {
    try {
      const response = await apiClient.post<AuthResponse>(
        API_ENDPOINTS.auth.signup,
        data
      )

      // Store tokens and user
      localStorage.setItem(STORAGE_KEYS.accessToken, response.accessToken)
      localStorage.setItem(STORAGE_KEYS.refreshToken, response.refreshToken)
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(response.user))
      
      setUser(response.user)
      router.push('/dashboard')
    } catch (error) {
      console.error('Signup failed:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await apiClient.post(API_ENDPOINTS.auth.logout)
    } catch (error) {
      console.error('Logout request failed:', error)
    } finally {
      clearAuth()
      router.push('/login')
    }
  }

  const refreshUser = async () => {
    try {
      const response = await apiClient.get<{ data: User }>(API_ENDPOINTS.auth.me)
      setUser(response.data)
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(response.data))
    } catch (error) {
      console.error('Failed to refresh user:', error)
      clearAuth()
    }
  }

  const clearAuth = () => {
    localStorage.removeItem(STORAGE_KEYS.accessToken)
    localStorage.removeItem(STORAGE_KEYS.refreshToken)
    localStorage.removeItem(STORAGE_KEYS.user)
    setUser(null)
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
