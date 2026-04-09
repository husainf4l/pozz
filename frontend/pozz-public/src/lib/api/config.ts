/**
 * API Configuration
 * Central configuration for API endpoints and settings
 */

// API Base URL - Update this to point to your backend
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    me: '/auth/me',
  },
  
  // Investors
  investors: {
    list: '/investors',
    create: '/investors',
    get: (id: string) => `/investors/${id}`,
    update: (id: string) => `/investors/${id}`,
    delete: (id: string) => `/investors/${id}`,
    search: '/investors/search',
  },
  
  // Projects
  projects: {
    list: '/projects',
    create: '/projects',
    get: (id: string) => `/projects/${id}`,
    update: (id: string) => `/projects/${id}`,
    delete: (id: string) => `/projects/${id}`,
    materials: (id: string) => `/projects/${id}/materials`,
  },
  
  // Pipeline
  pipeline: {
    list: '/pipeline',
    create: '/pipeline',
    get: (id: string) => `/pipeline/${id}`,
    update: (id: string) => `/pipeline/${id}`,
    delete: (id: string) => `/pipeline/${id}`,
    move: (id: string) => `/pipeline/${id}/move`,
  },
  
  // Meetings
  meetings: {
    list: '/meetings',
    create: '/meetings',
    get: (id: string) => `/meetings/${id}`,
    update: (id: string) => `/meetings/${id}`,
    delete: (id: string) => `/meetings/${id}`,
    upcoming: '/meetings/upcoming',
    past: '/meetings/past',
  },
  
  // Notes
  notes: {
    list: '/notes',
    create: '/notes',
    get: (id: string) => `/notes/${id}`,
    update: (id: string) => `/notes/${id}`,
    delete: (id: string) => `/notes/${id}`,
    search: '/notes/search',
  },
  
  // Distribution
  distribution: {
    list: '/distribution/platforms',
    platforms: '/distribution/platforms',
    create: '/distribution/platforms',
    get: (id: string) => `/distribution/platforms/${id}`,
    update: (id: string) => `/distribution/platforms/${id}`,
    delete: (id: string) => `/distribution/platforms/${id}`,
    analytics: (id: string) => `/distribution/platforms/${id}/analytics`,
  },
  
  // Analytics
  analytics: {
    dashboard: '/analytics/dashboard',
    overview: '/analytics/overview',
    investors: '/analytics/investors',
    financial: '/analytics/financial',
    pipeline: '/analytics/pipeline',
    export: '/analytics/export',
  },
  
  // Reports
  reports: {
    templates: '/reports/templates',
    generate: '/reports/generate',
    list: '/reports',
    get: (id: string) => `/reports/${id}`,
    download: (id: string) => `/reports/${id}/download`,
    delete: (id: string) => `/reports/${id}`,
    schedule: '/reports/schedule',
  },
  notifications: {
    base: '/notifications',
    list: '/notifications',
    read: '/notifications/:id/read',
    readAll: '/notifications/read-all',
    unread: '/notifications/unread-count',
  },
  activities: {
    base: '/activities',
    list: '/activities',
    byEntity: '/activities/:type/:id',
  },
  documents: {
    base: '/documents',
    list: '/documents',
    byId: '/documents/:id',
    folders: '/documents/folders',
    upload: '/documents/upload',
    share: '/documents/:id/share',
    download: '/documents/:id/download',
  },
  tasks: {
    base: '/tasks',
    list: '/tasks',
    byId: '/tasks/:id',
    complete: '/tasks/:id/complete',
    upcoming: '/tasks/upcoming',
  },
  calendar: {
    base: '/calendar',
    events: '/calendar/events',
    byId: '/calendar/events/:id',
    sync: '/calendar/sync/:provider',
  },
  emails: {
    base: '/emails',
    send: '/emails/send',
    templates: '/emails/templates',
    byId: '/emails/:id',
    tracking: '/emails/:id/tracking',
  },
  capTable: {
    base: '/cap-table',
    get: '/cap-table/:projectId',
    shareholders: '/cap-table/:projectId/shareholders',
    rounds: '/cap-table/:projectId/rounds',
    simulate: '/cap-table/:projectId/simulate',
  },
  settings: {
    base: '/settings',
    get: '/settings',
    update: '/settings',
    notifications: '/settings/notifications',
    integrations: '/settings/integrations',
  },
  team: {
    base: '/team',
    members: '/team/members',
    invite: '/team/invite',
    remove: '/team/:id',
    updateRole: '/team/:id/role',
  },
  workflows: {
    base: '/workflows',
    list: '/workflows',
    byId: '/workflows/:id',
    toggle: '/workflows/:id/toggle',
  },
  proposals: {
    base: '/proposals',
    list: '/proposals',
    byId: '/proposals/:id',
    send: '/proposals/:id/send',
  },
  search: {
    global: '/search',
    investors: '/search/investors',
    projects: '/search/projects',
    meetings: '/search/meetings',
    notes: '/search/notes',
  },
}

// Request timeout in milliseconds
export const REQUEST_TIMEOUT = 30000

// Retry settings
export const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000,
}

// Token storage keys
export const STORAGE_KEYS = {
  accessToken: 'pozz_access_token',
  refreshToken: 'pozz_refresh_token',
  user: 'pozz_user',
}
