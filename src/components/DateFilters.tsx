import { Calendar, CalendarDays } from 'lucide-react';

interface DateFiltersProps {
  dates: string[];
  months: string[];
  selectedDate: string;
  selectedMonth: string;
  dateRangeStart: string;
  dateRangeEnd: string;
  onDateChange: (date: string) => void;
  onMonthChange: (month: string) => void;
  onDateRangeStartChange: (date: string) => void;
  onDateRangeEndChange: (date: string) => void;
  formatMonthName: (month: string) => string;
}

export default function DateFilters({
  dates,
  months,
  selectedDate,
  selectedMonth,
  dateRangeStart,
  dateRangeEnd,
  onDateChange,
  onMonthChange,
  onDateRangeStartChange,
  onDateRangeEndChange,
  formatMonthName
}: DateFiltersProps) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">Date & Time Filters</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Specific Date Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📅 Specific Date
          </label>
          <select
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="all">All Dates</option>
            {dates.map(date => (
              <option key={date} value={date}>{date}</option>
            ))}
          </select>
        </div>

        {/* Month Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <CalendarDays className="w-4 h-4" />
            Month View
          </label>
          <select
            value={selectedMonth}
            onChange={(e) => onMonthChange(e.target.value)}
            className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="all">All Months</option>
            {months.map(month => (
              <option key={month} value={month}>{formatMonthName(month)}</option>
            ))}
          </select>
        </div>

        {/* Date Range Start */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📍 From Date
          </label>
          <select
            value={dateRangeStart}
            onChange={(e) => onDateRangeStartChange(e.target.value)}
            className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="">Start Date</option>
            {dates.map(date => (
              <option key={date} value={date}>{date}</option>
            ))}
          </select>
        </div>

        {/* Date Range End */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📍 To Date
          </label>
          <select
            value={dateRangeEnd}
            onChange={(e) => onDateRangeEndChange(e.target.value)}
            className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="">End Date</option>
            {dates.map(date => (
              <option key={date} value={date}>{date}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      <div className="mt-4 flex flex-wrap gap-2">
        {selectedDate !== 'all' && (
          <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
            <span>Date: {selectedDate}</span>
            <button onClick={() => onDateChange('all')} className="hover:bg-blue-600 rounded-full">
              ✕
            </button>
          </div>
        )}
        {selectedMonth !== 'all' && (
          <div className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
            <span>Month: {formatMonthName(selectedMonth)}</span>
            <button onClick={() => onMonthChange('all')} className="hover:bg-purple-600 rounded-full">
              ✕
            </button>
          </div>
        )}
        {dateRangeStart && dateRangeEnd && (
          <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
            <span>Range: {dateRangeStart} to {dateRangeEnd}</span>
            <button 
              onClick={() => {
                onDateRangeStartChange('');
                onDateRangeEndChange('');
              }} 
              className="hover:bg-green-600 rounded-full"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
