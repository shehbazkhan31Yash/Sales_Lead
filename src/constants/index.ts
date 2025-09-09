export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.leadiq.com';

export const ROUTES = {
  LOGIN: '/login',
  LANDING: '/',
  DASHBOARD: '/dashboard',
  PROCESS_LEADS: '/process-leads',
  LEADS: '/leads',
} as const;

export const LEAD_STATUS = {
  QUALIFIED: 'qualified',
  UNQUALIFIED: 'unqualified',
  CONVERTED: 'converted',
  PENDING: 'pending',
} as const;

export const PROCESSING_STEPS = {
  UPLOAD: 'upload',
  EXTRACT: 'extract',
  ANALYZE: 'analyze',
  COMPLETE: 'complete',
} as const;

export const COLORS = {
  primary: '#6366F1',
  secondary: '#8B5CF6',
  accent: '#EC4899',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
} as const;