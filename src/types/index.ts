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
  companySize: string[];
  source: string[];
  dateRange: [string, string];
}

export interface CompanySize {
  id: string;
  label: string;
  range: string;
}

export interface Industry {
  id: string;
  name: string;
  count: number;
}

// new Leads data type
export interface LeadsData {
  Lead_ID: string
  Name: string
  Company: string
  Industry: string
  Region: string
  Job_Title: string
  Company_Size: string
  Email_Opens?: string
  Web_Visits?: string
  Campaign_Clicks?: string
  Past_Purchases: string
  Converted: string
  Profile_Score?: number
  Initial_Lead_Score?: number
  Conversion_Probability?: number
  Recommended_Services?: string[]
  Engagement_Summary?: EngagementSummary,
  createdAt?: string | Date,
  Status?: string,
  Interested_Services? : string[] | string,
}

export interface ProcessedLead {
  Lead_ID: string
  Profile_Score: number
  Initial_Lead_Score: number
  Conversion_Probability: number
  Recommended_Services: any[]
  Engagement_Summary: EngagementSummary
}

export interface EngagementSummary {
  Total_Email_Opens?: number
  Total_Web_Visits?: number
  Total_Campaign_Clicks?: number
  Last_Interaction_Date?: string| Date
}