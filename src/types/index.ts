export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  phone?: string;
  industry: string;
  score: number;
  status: 'qualified' | 'unqualified' | 'converted' | 'pending';
  source: string;
  createdAt: string;
  lastContact?: string;
  notes?: string;
  revenue?: number;
}

export interface LeadStats {
  totalLeads: number;
  qualifiedLeads: number;
  convertedLeads: number;
  conversionRate: number;
  averageScore: number;
  totalRevenue: number;
}

export interface ProcessingStatus {
  step: 'upload' | 'extract' | 'analyze' | 'complete';
  progress: number;
  message: string;
  isProcessing: boolean;
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface FilterOptions {
  status: string[];
  scoreRange: [number, number];
  industry: string[];
  dateRange: [string, string];
}