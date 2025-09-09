import { Lead, LeadStats, ChartData } from '../types';

// Mock data for demonstration
const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@techcorp.com',
    company: 'TechCorp Solutions',
    phone: '+1-555-0123',
    industry: 'Technology',
    score: 92,
    status: 'qualified',
    source: 'Website',
    createdAt: '2024-01-15T10:30:00Z',
    lastContact: '2024-01-20T14:15:00Z',
    revenue: 45000,
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael@startup.io',
    company: 'StartupFlow',
    phone: '+1-555-0124',
    industry: 'SaaS',
    score: 87,
    status: 'qualified',
    source: 'LinkedIn',
    createdAt: '2024-01-14T09:20:00Z',
    revenue: 32000,
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    email: 'emma@consulting.com',
    company: 'Business Consulting Group',
    industry: 'Consulting',
    score: 78,
    status: 'converted',
    source: 'Referral',
    createdAt: '2024-01-12T16:45:00Z',
    revenue: 78000,
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david@healthtech.com',
    company: 'HealthTech Innovations',
    industry: 'Healthcare',
    score: 65,
    status: 'pending',
    source: 'Cold Email',
    createdAt: '2024-01-18T11:30:00Z',
    revenue: 0,
  },
  {
    id: '5',
    name: 'Lisa Wang',
    email: 'lisa@financeplus.com',
    company: 'Finance Plus',
    industry: 'Finance',
    score: 43,
    status: 'unqualified',
    source: 'Website',
    createdAt: '2024-01-16T13:20:00Z',
    revenue: 0,
  },
  {
    id: '6',
    name: 'Robert Smith',
    email: 'robert@manufacturing.com',
    company: 'Global Manufacturing Inc',
    phone: '+1-555-0125',
    industry: 'Manufacturing',
    score: 89,
    status: 'qualified',
    source: 'Trade Show',
    createdAt: '2024-01-10T08:15:00Z',
    revenue: 125000,
  },
  {
    id: '7',
    name: 'Jennifer Davis',
    email: 'jennifer@retailchain.com',
    company: 'Retail Chain Solutions',
    industry: 'Retail',
    score: 72,
    status: 'converted',
    source: 'Google Ads',
    createdAt: '2024-01-08T14:30:00Z',
    revenue: 56000,
  },
  {
    id: '8',
    name: 'Alex Thompson',
    email: 'alex@edtech.com',
    company: 'EduTech Innovations',
    industry: 'Education',
    score: 81,
    status: 'qualified',
    source: 'Content Marketing',
    createdAt: '2024-01-05T16:20:00Z',
    revenue: 0,
  },
];

export const leadService = {
  async getLeads(): Promise<Lead[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockLeads), 800);
    });
  },

  async getLeadStats(): Promise<LeadStats> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stats: LeadStats = {
          totalLeads: mockLeads.length,
          qualifiedLeads: mockLeads.filter(lead => lead.status === 'qualified').length,
          convertedLeads: mockLeads.filter(lead => lead.status === 'converted').length,
          conversionRate: (mockLeads.filter(lead => lead.status === 'converted').length / mockLeads.length) * 100,
          averageScore: mockLeads.reduce((sum, lead) => sum + lead.score, 0) / mockLeads.length,
          totalRevenue: mockLeads.reduce((sum, lead) => sum + (lead.revenue || 0), 0),
        };
        resolve(stats);
      }, 600);
    });
  },

  async getTopLeads(limit = 10): Promise<Lead[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const topLeads = [...mockLeads]
          .sort((a, b) => b.score - a.score)
          .slice(0, limit);
        resolve(topLeads);
      }, 500);
    });
  },

  async getChartData(): Promise<ChartData[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = [
          { name: 'Qualified', value: 2, color: '#10B981' },
          { name: 'Converted', value: 1, color: '#6366F1' },
          { name: 'Pending', value: 1, color: '#F59E0B' },
          { name: 'Unqualified', value: 1, color: '#EF4444' },
        ];
        resolve(data);
      }, 400);
    });
  },

  async processFile(file: File): Promise<{ success: boolean; leadsCount: number }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, leadsCount: 25 });
      }, 3000);
    });
  },

  async getIndustries(): Promise<{ id: string; name: string; count: number }[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const industries = [
          { id: 'technology', name: 'Technology', count: 15 },
          { id: 'saas', name: 'SaaS', count: 12 },
          { id: 'healthcare', name: 'Healthcare', count: 8 },
          { id: 'finance', name: 'Finance', count: 10 },
          { id: 'consulting', name: 'Consulting', count: 6 },
          { id: 'manufacturing', name: 'Manufacturing', count: 9 },
          { id: 'retail', name: 'Retail', count: 7 },
          { id: 'education', name: 'Education', count: 4 },
        ];
        resolve(industries);
      }, 300);
    });
  },

  async getSources(): Promise<string[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const sources = [
          'Website',
          'LinkedIn',
          'Referral',
          'Cold Email',
          'Trade Show',
          'Google Ads',
          'Content Marketing',
          'Social Media',
          'Partner',
          'Direct Mail'
        ];
        resolve(sources);
      }, 300);
    });
  },

  async getCompanySizes(): Promise<{ id: string; label: string; range: string }[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const sizes = [
          { id: 'startup', label: 'Startup', range: '1-10 employees' },
          { id: 'small', label: 'Small', range: '11-50 employees' },
          { id: 'medium', label: 'Medium', range: '51-200 employees' },
          { id: 'large', label: 'Large', range: '201-1000 employees' },
          { id: 'enterprise', label: 'Enterprise', range: '1000+ employees' },
        ];
        resolve(sizes);
      }, 300);
    });
  },
};