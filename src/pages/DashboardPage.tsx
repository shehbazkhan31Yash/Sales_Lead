import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { FilterPanel } from '../components/dashboard/FilterPanel';
import { leadService } from '../services/leadService';
import { Lead, LeadStats, ChartData, FilterOptions, LeadsData } from '../types';
import {
  Users,
  TrendingUp,
  DollarSign,
  Target,
  Star,
  Phone,
  Mail,
  Building,
  Filter,
  Search,
  Download,
  Calendar,
  MessageCircleHeart,
  AlertCircleIcon,
  PercentCircle,
  CalculatorIcon
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import EmailModelPage from './emailModel';

export const DashboardPage: React.FC = () => {
  const [leads, setLeads] = useState<LeadsData[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<LeadsData[]>([]);
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [topLeads, setTopLeads] = useState<LeadsData[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeadContent, setSelectedLeadContent] = useState<LeadsData | null>(null);
  const [openEmailModel, setOpenEmailModel] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterOptions>({
    status: [],
    scoreRange: [0, 100],
    industry: [],
    companySize: [],
    source: [],
    dateRange: ['', ''],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leadsData, statsData, topLeadsData, chartDataResponse] = await Promise.all([
          leadService.getLeads(),
          leadService.getLeadStats(),
          leadService.getTopLeads(5),
          leadService.getChartData(),
        ]);
        setLeads(leadsData);
        setStats(statsData);
        setTopLeads(topLeadsData);
        setChartData(chartDataResponse);
        setFilteredLeads(leadsData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...leads];
    // Apply search filter
    if (searchTerm && searchTerm.trim() !== '') {
      filtered = filtered.filter(lead =>
        lead['Name'].toLowerCase().includes(searchTerm.toLowerCase()) ||
        // lead.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead['Company'].toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filters.status.length > 0) {
      filtered = filtered.filter((lead: LeadsData) => filters.status.includes(lead['Status'] || ''));
    }

    // Apply score range filter
    // filtered = filtered.filter(lead => 
    //   lead['Initial_Lead_Score'] && lead['Initial_Lead_Score'] >= filters.scoreRange[0] && lead['Initial_Lead_Score'] <= filters.scoreRange[1]
    // );

    // Apply industry filter
    if (filters.industry.length > 0) {
      filtered = filtered.filter(lead => filters.industry.includes(lead['Industry']));
    }

    // Apply source filter
    // if (filters.source.length > 0) {
    //   filtered = filtered.filter(lead => filters.source.includes(lead.source));
    // }

    // Apply date range filter
    if (filters.dateRange[0] && filters.dateRange[1]) {
      const startDate = new Date(filters.dateRange[0]);
      const endDate = new Date(filters.dateRange[1]);
      filtered = filtered.filter(lead => {
        const leadDate = new Date(lead['createdAt'] as string);
        return leadDate >= startDate && leadDate <= endDate;
      });
    }
    setFilteredLeads(filtered);
  }, [leads, searchTerm, filters]);

  const handleApplyFilters = () => {
    setIsFilterOpen(false);
  };

  const handleResetFilters = () => {
    setFilters({
      status: [],
      scoreRange: [0, 100],
      industry: [],
      companySize: [],
      source: [],
      dateRange: ['', ''],
    });
    setSearchTerm('');
  };

  const getActiveFiltersCount = () => {
    return filters.status.length +
      filters.industry.length +
      filters.companySize.length +
      filters.source.length +
      (filters.dateRange[0] && filters.dateRange[1] ? 1 : 0);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getStatusColor = (status: string) => {
    //Converted, Interested, Not Interested
    switch (status) {
      case 'Interested': return 'bg-green-100 text-green-800';
      case 'Converted': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'Not Interested': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header with Search and Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">AI-powered lead insights and analytics</p>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Filter Button */}
            <Button
              variant="outline"
              onClick={() => setIsFilterOpen(true)}
              className="relative"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
              {getActiveFiltersCount() > 0 && (
                <span className="absolute -top-2 -right-2 h-5 w-5 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center">
                  {getActiveFiltersCount()}
                </span>
              )}
            </Button>

            {/* Export Button */}
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Active Filters Display */}
        {getActiveFiltersCount() > 0 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Active Filters:</span>
                  <div className="flex flex-wrap gap-2">
                    {filters.status.map(status => (
                      <span key={status} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        Status: {status}
                      </span>
                    ))}
                    {filters.industry.map(industry => (
                      <span key={industry} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Industry: {industry}
                      </span>
                    ))}
                    {filters.source.map(source => (
                      <span key={source} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                        Source: {source}
                      </span>
                    ))}
                    {filters.dateRange[0] && filters.dateRange[1] && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                        <Calendar className="inline h-3 w-3 mr-1" />
                        {filters.dateRange[0]} to {filters.dateRange[1]}
                      </span>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={handleResetFilters}>
                  Clear All
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Showing {filteredLeads.length} of {leads.length} leads
            {searchTerm && ` for "${searchTerm}"`}
          </span>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Total Leads</p>
                  <p className="text-3xl font-bold">{stats?.totalLeads}</p>
                </div>
                <Users className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Converted (Hot)</p>
                  <p className="text-3xl font-bold">{stats?.convertedLeads}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Interested (Warm)</p>
                  <p className="text-3xl font-bold">{stats?.qualifiedLeads}</p>
                </div>
                <Target className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>


          <Card className="bg-gradient-to-r from-green-500 to-pink-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-100">Conversion Rate</p>
                  <p className="text-3xl font-bold">{stats?.conversionRate}</p>
                </div>
                <CalculatorIcon className="h-8 w-8 text-pink-200" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-blue-500 to-pink-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-100">Average Score</p>
                  <p className="text-3xl font-bold">{stats?.averageScore}</p>
                </div>
                <PercentCircle className="h-8 w-8 text-pink-200" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-red-400 to-red-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-100">No Interested (Cold)</p>
                  <p className="text-3xl font-bold">{stats?.notInterested}</p>
                </div>
                <AlertCircleIcon className="h-8 w-8 text-pink-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lead Status Chart */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <h3 className="text-lg font-semibold">Lead Status Distribution</h3>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Leads */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <h3 className="text-lg font-semibold flex items-center">
                <Star className="mr-2 h-5 w-5 text-yellow-500" />
                Top Scored Leads
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topLeads.map((lead) => (
                  <div key={lead['Lead_ID']} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(lead['Initial_Lead_Score'] ? lead['Initial_Lead_Score'] : 0)}`}>
                        {lead['Initial_Lead_Score'] ? lead['Initial_Lead_Score'] : 'NA'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{lead['Name']}</p>
                        <p className="text-sm text-gray-500">{lead['Company']}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(lead['Status'] ? lead['Status'] : '')}`}>
                        {lead['Status']}

                      </span>
                      <Button size="sm" variant="outline" onClick={() => {
                        setSelectedLeadContent(lead);
                        setOpenEmailModel(true);
                      }}>
                        <MessageCircleHeart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Leads Table */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Recent Leads</h3>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead className='bg-gray-50'>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700 whitespace-nowrap">Lead Id</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 whitespace-nowrap">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 whitespace-nowrap">Company</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 whitespace-nowrap">Industry</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 whitespace-nowrap">Company Size</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 whitespace-nowrap">Job Title</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 whitespace-nowrap">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 whitespace-nowrap">Lead Score</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 whitespace-nowrap">Conversion Probability (0-1)</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 whitespace-nowrap">Profile Score (0-1)</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 whitespace-nowrap">Interested Services/Recommended Services</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 whitespace-nowrap">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr key={lead['Lead_ID']} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div>
                          <p className="font-medium text-gray-900">{lead['Lead_ID']}</p>
                          {/* <p className="text-sm text-gray-500">{lead['Name']}</p> */}
                        </div>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div>
                          <p className="font-medium text-gray-900">{lead['Name']}</p>
                          {/* <p className="text-sm text-gray-500">{lead['Name']}</p> */}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <Building className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-900">{lead['Company']}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <Building className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-900">{lead['Industry']}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          {/* <Building className="h-4 w-4 text-gray-400 mr-2" /> */}
                          <span className="text-gray-900">{lead['Company_Size']}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          {/* <Building className="h-4 w-4 text-gray-400 mr-2" /> */}
                          <span className="text-gray-900">{lead['Job_Title']}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          {/* <Building className="h-4 w-4 text-gray-400 mr-2" /> */}
                          <span className="text-gray-900">{lead['Status']}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(lead['Initial_Lead_Score'] ? lead['Initial_Lead_Score'] : 0)}`}>
                          {lead['Initial_Lead_Score'] ? lead['Initial_Lead_Score'] : 'NA'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {/* <span className={`px-3 py-1 text-xs rounded-full ${getStatusColor(lead.status)}`}>
                          {lead['Conversion_Probability']}
                        </span> */}
                        <span className={`px-3 py-1 text-xs rounded-full`}>
                          {lead['Conversion_Probability']}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{lead['Profile_Score']}</td>
                      <td className="py-4 px-4 text-gray-600">{lead['Interested_Services'] && lead['Interested_Services'].length > 0 ? lead['Interested_Services'] : 'NA'}-{lead['Recommended_Services']?.length && lead['Recommended_Services']?.length > 0 ? JSON.stringify(lead['Recommended_Services']) : 'NA'}</td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded flex items-center">
                            <Mail className="h-4 w-4 mr-1" />
                            <span className="text-gray-900">{lead['Email'] || 'NA'}</span>
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Button size="sm" variant="outline" onClick={() => {
                          setSelectedLeadContent(lead);
                          setOpenEmailModel(true);
                        }}>
                          <MessageCircleHeart className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Filter Panel */}
        <FilterPanel
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          filters={filters}
          onFiltersChange={setFilters}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
        />
        {/* Email Model Dialog */
          selectedLeadContent &&
          <EmailModelPage isOpenDialog={openEmailModel} selectedLead={selectedLeadContent} handleclose={(e: boolean) => { setOpenEmailModel(e); setSelectedLeadContent(null) }} />
        }
      </div>
    </Layout>
  );
};