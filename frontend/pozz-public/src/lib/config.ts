// Auth URLs configuration
// In development: points to localhost:3401 (pozz-app Angular app)
// In production: should point to your production app domain

const isDevelopment = process.env.NODE_ENV === 'development'

export const AUTH_CONFIG = {
  // Base URL for the auth app (pozz-app)
  APP_URL: isDevelopment ? 'http://localhost:3401' : process.env.NEXT_PUBLIC_APP_URL || 'https://app.pozz.io',
  
  // Auth routes (Angular app uses locale-based routing: /en/auth/...)
  LOGIN_URL: isDevelopment ? 'http://localhost:3401/en/auth/login' : `${process.env.NEXT_PUBLIC_APP_URL || 'https://app.pozz.io'}/en/auth/login`,
  SIGNUP_URL: isDevelopment ? 'http://localhost:3401/en/auth/register' : `${process.env.NEXT_PUBLIC_APP_URL || 'https://app.pozz.io'}/en/auth/register`,
}
