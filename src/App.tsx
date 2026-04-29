import { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import {
  Users, Target, MessageSquare, FileText, TrendingUp, RefreshCw, Filter, Calendar, Award
} from 'lucide-react';
import KPICard from './components/KPICard';
import PerformerCard from './components/PerformerCard';
import MemberDetailCard from './components/MemberDetailCard';
import DateFilters from './components/DateFilters';
import FilterSummary from './components/FilterSummary';
import { BDMemberPerformance, BDMemberData } from './types';
import { 
  fetchAllData, 
  aggregateMemberData, 
  getUniqueDates, 
  getUniqueMonths,
  formatMonthName,
  groupByDate
} from './utils/googleSheets';
import { DASHBOARD_CONFIG } from './config/dashboard';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];

function App() {
  const [loading, setLoading] = useState(true);
  const [allRawData, setAllRawData] = useState<BDMemberData[]>([]);
  const [memberData, setMemberData] = useState<BDMemberPerformance[]>([]);
  const [filteredData, setFilteredData] = useState<BDMemberPerformance[]>([]);
  const [selectedMember, setSelectedMember] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('overallScore');
  
  // Date filters
  const [selectedDate, setSelectedDate] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [dateRangeStart, setDateRangeStart] = useState<string>('');
  const [dateRangeEnd, setDateRangeEnd] = useState<string>('');
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterAndSortData();
  }, [allRawData, memberData, selectedMember, sortBy, selectedDate, selectedMonth, dateRangeStart, dateRangeEnd]);

  const loadData = async () => {
    setLoading(true);
    try {
      const allData = await fetchAllData();
      setAllRawData(allData);
      
      // Get unique dates and months
      const dates = getUniqueDates(allData);
      const months = getUniqueMonths(allData);
      setAvailableDates(dates);
      setAvailableMonths(months);
      
      const aggregated = aggregateMemberData(allData);
      setMemberData(aggregated);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortData = () => {
    // First, filter the raw data by date/month/range
    let dateFilteredRawData = [...allRawData];
    
    // Apply specific date filter
    if (selectedDate !== 'all') {
      dateFilteredRawData = dateFilteredRawData.filter(d => d.date === selectedDate);
    }
    
    // Apply month filter
    if (selectedMonth !== 'all') {
      dateFilteredRawData = dateFilteredRawData.filter(d => {
        const parts = d.date.split('-');
        const month = parts.length >= 2 ? `${parts[1]}-${parts[2]}` : '';
        return month === selectedMonth;
      });
    }
    
    // Apply date range filter
    if (dateRangeStart && dateRangeEnd) {
      dateFilteredRawData = dateFilteredRawData.filter(d => {
        const [day, month, year] = d.date.split('-').map(Number);
        const [startDay, startMonth, startYear] = dateRangeStart.split('-').map(Number);
        const [endDay, endMonth, endYear] = dateRangeEnd.split('-').map(Number);
        
        const current = new Date(year, month - 1, day);
        const start = new Date(startYear, startMonth - 1, startDay);
        const end = new Date(endYear, endMonth - 1, endDay);
        
        return current >= start && current <= end;
      });
    }
    
    // Aggregate the filtered data
    const aggregated = aggregateMemberData(dateFilteredRawData);
    
    // Apply member filter
    let filtered = [...aggregated];
    if (selectedMember !== 'all') {
      filtered = filtered.filter(m => m.bdMember === selectedMember);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'overallScore':
          return b.metrics.overallScore - a.metrics.overallScore;
        case 'connections':
          return b.totalConnections - a.totalConnections;
        case 'leads':
          return b.leadsReverted - a.leadsReverted;
        case 'conversion':
          return b.metrics.leadConversionRate - a.metrics.leadConversionRate;
        default:
          return 0;
      }
    });

    setFilteredData(filtered);
  };

  // Calculate overall KPIs
  const totalConnections = memberData.reduce((sum, m) => sum + m.totalConnections, 0);
  const totalConnectionTarget = memberData.reduce((sum, m) => sum + m.connectionTarget, 0);
  const totalMessages = memberData.reduce((sum, m) => sum + m.totalMessagesSent, 0);
  const totalMessageTarget = memberData.reduce((sum, m) => sum + m.messageTarget, 0);
  const totalLeads = memberData.reduce((sum, m) => sum + m.leadsReverted, 0);
  const totalResumes = memberData.reduce((sum, m) => sum + m.resumeTargetAchieved, 0);
  const totalDashboardUpdates = memberData.reduce((sum, m) => sum + m.leadsUpdatedInDashboard, 0);

  const avgConversionRate = totalMessages > 0 ? Math.min((totalLeads / totalMessages) * 100, 100) : 0;
  const connectionAchievement = totalConnectionTarget > 0 ? Math.min((totalConnections / totalConnectionTarget) * 100, 100) : 0;

  // Get top and low performers
  const topPerformer = [...memberData].sort((a, b) => b.metrics.overallScore - a.metrics.overallScore)[0];
  const lowPerformer = [...memberData].sort((a, b) => a.metrics.overallScore - b.metrics.overallScore)[0];

  // Chart data
  const performanceChartData = filteredData.map(m => ({
    name: m.bdMember,
    'Connection %': m.metrics.connectionAchievement,
    'Message %': m.metrics.messageAchievement,
    'Lead Conversion %': m.metrics.leadConversionRate,
    'Resume %': m.metrics.resumeAchievement
  }));

  const leadsChartData = filteredData.map(m => ({
    name: m.bdMember,
    Connections: m.totalConnections,
    Messages: m.totalMessagesSent,
    Leads: m.leadsReverted,
    Resumes: m.resumeTargetAchieved
  }));

  const conversionPieData = filteredData.map(m => ({
    name: m.bdMember,
    value: m.leadsReverted
  }));

  const radarData = filteredData.slice(0, 1).length > 0 ? [
    {
      metric: 'Connections',
      value: filteredData[0].metrics.connectionAchievement,
      fullMark: 150
    },
    {
      metric: 'Messages',
      value: filteredData[0].metrics.messageAchievement,
      fullMark: 150
    },
    {
      metric: 'Lead Conv',
      value: filteredData[0].metrics.leadConversionRate,
      fullMark: 100
    },
    {
      metric: 'Resumes',
      value: filteredData[0].metrics.resumeAchievement,
      fullMark: 150
    },
    {
      metric: 'Dashboard',
      value: filteredData[0].metrics.dashboardUpdateRate,
      fullMark: 100
    }
  ] : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-700">Loading BD Performance Data...</p>
          <p className="text-sm text-gray-500 mt-2">
            Fetching data from {DASHBOARD_CONFIG.START_DATE} to {DASHBOARD_CONFIG.END_DATE}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-lg">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">BD Performance Dashboard</h1>
                <p className="text-sm text-gray-500 flex items-center gap-2 whitespace-nowrap">
                  <Calendar className="w-4 h-4 flex-shrink-0" />
                  <span>{DASHBOARD_CONFIG.START_DATE} to {DASHBOARD_CONFIG.END_DATE}</span>
                </p>
              </div>
            </div>
            <button
              onClick={loadData}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Data
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Date Filters */}
        <DateFilters
          dates={availableDates}
          months={availableMonths}
          selectedDate={selectedDate}
          selectedMonth={selectedMonth}
          dateRangeStart={dateRangeStart}
          dateRangeEnd={dateRangeEnd}
          onDateChange={setSelectedDate}
          onMonthChange={setSelectedMonth}
          onDateRangeStartChange={setDateRangeStart}
          onDateRangeEndChange={setDateRangeEnd}
          formatMonthName={formatMonthName}
        />

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 mt-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Member & Sort Filters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select BD Member
              </label>
              <select
                value={selectedMember}
                onChange={(e) => setSelectedMember(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Members</option>
                {memberData.map(m => (
                  <option key={m.bdMember} value={m.bdMember}>{m.bdMember}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="overallScore">Overall Score</option>
                <option value="connections">Total Connections</option>
                <option value="leads">Total Leads</option>
                <option value="conversion">Conversion Rate</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filter Summary */}
        <FilterSummary
          selectedDate={selectedDate}
          selectedMonth={selectedMonth}
          dateRangeStart={dateRangeStart}
          dateRangeEnd={dateRangeEnd}
          selectedMember={selectedMember}
          totalRecords={filteredData.length}
          formatMonthName={formatMonthName}
        />

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Total Connections"
            value={totalConnections}
            icon={Users}
            trend={connectionAchievement - 100}
            suffix={` / ${totalConnectionTarget}`}
            color="blue"
          />
          <KPICard
            title="Messages Sent"
            value={totalMessages}
            icon={MessageSquare}
            suffix={` / ${totalMessageTarget}`}
            color="purple"
          />
          <KPICard
            title="Leads Generated"
            value={totalLeads}
            icon={TrendingUp}
            trend={avgConversionRate}
            color="green"
          />
          <KPICard
            title="Resumes Collected"
            value={totalResumes}
            icon={FileText}
            color="orange"
          />
        </div>

        {/* Additional KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <KPICard
            title="Avg Conversion Rate"
            value={avgConversionRate.toFixed(1)}
            icon={Target}
            suffix="%"
            color="indigo"
          />
          <KPICard
            title="Dashboard Updates"
            value={totalDashboardUpdates}
            icon={Target}
            suffix={` / ${totalLeads}`}
            color="green"
          />
          <KPICard
            title="Active BD Members"
            value={memberData.length}
            icon={Users}
            color="blue"
          />
        </div>

        {/* Top & Low Performers */}
        {topPerformer && lowPerformer && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <PerformerCard performer={topPerformer} type="top" />
            <PerformerCard performer={lowPerformer} type="low" />
          </div>
        )}

        {/* Performance Comparison Chart */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Performance Achievement (%)</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={performanceChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Connection %" fill="#3b82f6" />
              <Bar dataKey="Message %" fill="#8b5cf6" />
              <Bar dataKey="Lead Conversion %" fill="#10b981" />
              <Bar dataKey="Resume %" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Activity Chart */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Activity Overview</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={leadsChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Connections" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="Messages" stroke="#8b5cf6" strokeWidth={2} />
              <Line type="monotone" dataKey="Leads" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="Resumes" stroke="#f59e0b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Date-wise Trend Chart */}
        {selectedMember === 'all' && selectedDate === 'all' && !dateRangeStart && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">📈 Daily Performance Trends</h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={groupByDate(allRawData).map(d => ({
                date: d.date,
                Connections: d.totals.connections,
                Messages: d.totals.messages,
                Leads: d.totals.leads,
                Resumes: d.totals.resumes
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  interval={Math.floor(availableDates.length / 10) || 0}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Connections" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Messages" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Leads" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Resumes" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Pie Chart and Radar Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Lead Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={conversionPieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {conversionPieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {selectedMember !== 'all' && radarData.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                {filteredData[0]?.bdMember} - Performance Radar
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis angle={90} domain={[0, 150]} />
                  <Radar
                    name={filteredData[0]?.bdMember}
                    dataKey="value"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.6}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Member Detail Cards */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Team Member Details</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredData.map(member => (
              <MemberDetailCard key={member.bdMember} member={member} />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <p className="text-gray-600">
            Dashboard automatically updates when new data is added to the Google Sheet
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Last updated: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
