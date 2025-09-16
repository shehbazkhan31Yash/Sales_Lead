import React, { useState, useEffect } from 'react';
import { X, Calendar, Building, Users, Target, Filter, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { FilterOptions } from '../../types';
import { leadService } from '../../services/leadService';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onApplyFilters,
  onResetFilters,
}) => {
  const [industries, setIndustries] = useState<{ id: string; name: string; count: number }[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [companySizes, setCompanySizes] = useState<{ id: string; label: string; range: string }[]>([]);

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const [industriesData, sourcesData, companySizesData] = await Promise.all([
          leadService.getIndustries(),
          leadService.getSources(),
          leadService.getCompanySizes(),
        ]);
        setIndustries(industriesData);
        setSources(sourcesData);
        setCompanySizes(companySizesData);
      } catch (error) {
        console.error('Failed to fetch filter data:', error);
      }
    };

    if (isOpen) {
      fetchFilterData();
    }
  }, [isOpen]);

  const handleStatusChange = (status: string) => {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter(s => s !== status)
      : [...filters.status, status];
    onFiltersChange({ ...filters, status: newStatus });
  };

  const handleIndustryChange = (industry: string) => {
    const newIndustries = filters.industry.includes(industry)
      ? filters.industry.filter(i => i !== industry)
      : [...filters.industry, industry];
    onFiltersChange({ ...filters, industry: newIndustries });
  };

  const handleCompanySizeChange = (size: string) => {
    const newSizes = filters.companySize.includes(size)
      ? filters.companySize.filter(s => s !== size)
      : [...filters.companySize, size];
    onFiltersChange({ ...filters, companySize: newSizes });
  };

  const handleSourceChange = (source: string) => {
    const newSources = filters.source.includes(source)
      ? filters.source.filter(s => s !== source)
      : [...filters.source, source];
    onFiltersChange({ ...filters, source: newSources });
  };

  const handleScoreRangeChange = (index: number, value: string) => {
    const newRange: [number, number] = [...filters.scoreRange];
    newRange[index] = parseInt(value) || 0;
    onFiltersChange({ ...filters, scoreRange: newRange });
  };

  const handleDateRangeChange = (index: number, value: string) => {
    const newRange: [string, string] = [...filters.dateRange];
    newRange[index] = value;
    onFiltersChange({ ...filters, dateRange: newRange });
  };

  const statusOptions = [
    { value: 'Interested', label: 'Interested', color: 'bg-green-100 text-green-800' },
    { value: 'Converted', label: 'Converted', color: 'bg-blue-100 text-blue-800' },
    { value: 'Not Interested', label: 'Not Interested', color: 'bg-red-100 text-red-800' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-2xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 p-6">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Filter Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Date Range */}
            {/* {commented for now} */}
            {/* <div>
              <div className="flex items-center space-x-2 mb-3">
                <Calendar className="h-4 w-4 text-gray-500" />
                <label className="text-sm font-medium text-gray-700">Date Range</label>
              </div>
              <div className="space-y-2">
                <input
                  type="date"
                  value={filters.dateRange[0]}
                  onChange={(e) => handleDateRangeChange(0, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="date"
                  value={filters.dateRange[1]}
                  onChange={(e) => handleDateRangeChange(1, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div> */}

            {/* Lead Status */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Target className="h-4 w-4 text-gray-500" />
                <label className="text-sm font-medium text-gray-700">Lead Status</label>
              </div>
              <div className="space-y-2">
                {statusOptions.map((status) => (
                  <label key={status.value} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.status.includes(status.value)}
                      onChange={() => handleStatusChange(status.value)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className={`px-2 py-1 text-xs rounded-full ${status.color}`}>
                      {status.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Score Range */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">Score Range</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={filters.scoreRange[0]}
                  onChange={(e) => handleScoreRangeChange(0, e.target.value)}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Min"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={filters.scoreRange[1]}
                  onChange={(e) => handleScoreRangeChange(1, e.target.value)}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Max"
                />
              </div>
            </div>

            {/* Industry */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Building className="h-4 w-4 text-gray-500" />
                <label className="text-sm font-medium text-gray-700">Industry</label>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {industries.map((industry) => (
                  <label key={industry.id} className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={filters.industry.includes(industry.name)}
                        onChange={() => handleIndustryChange(industry.name)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">{industry.name}</span>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {industry.count}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Company Size */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Users className="h-4 w-4 text-gray-500" />
                <label className="text-sm font-medium text-gray-700">Company Size</label>
              </div>
              <div className="space-y-2">
                {companySizes.map((size) => (
                  <label key={size.id} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.companySize.includes(size.id)}
                      onChange={() => handleCompanySizeChange(size.id)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-700">{size.label}</span>
                      <span className="text-xs text-gray-500">{size.range}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Lead Source */}
            {/* <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">Lead Source</label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {sources.map((source) => (
                  <label key={source} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.source.includes(source)}
                      onChange={() => handleSourceChange(source)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">{source}</span>
                  </label>
                ))}
              </div>
            </div> */}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6 space-y-3">
            <Button onClick={onApplyFilters} className="w-full">
              Apply Filters
            </Button>
            <Button
              variant="outline"
              onClick={onResetFilters}
              className="w-full"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};