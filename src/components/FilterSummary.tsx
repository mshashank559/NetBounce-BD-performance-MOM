import { Info } from 'lucide-react';

interface FilterSummaryProps {
  selectedDate: string;
  selectedMonth: string;
  dateRangeStart: string;
  dateRangeEnd: string;
  selectedMember: string;
  totalRecords: number;
  formatMonthName: (month: string) => string;
}

export default function FilterSummary({
  selectedDate,
  selectedMonth,
  dateRangeStart,
  dateRangeEnd,
  selectedMember,
  totalRecords,
  formatMonthName
}: FilterSummaryProps) {
  const hasFilters = selectedDate !== 'all' || selectedMonth !== 'all' || 
                     (dateRangeStart && dateRangeEnd) || selectedMember !== 'all';

  if (!hasFilters) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-4 mb-6">
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-semibold mb-2">Active Filters Applied</h3>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {selectedDate !== 'all' && (
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="opacity-80">Date:</span> 
                <span className="font-bold bg-white/20 px-2 py-0.5 rounded">{selectedDate}</span>
              </div>
            )}
            {selectedMonth !== 'all' && (
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="opacity-80">Month:</span> 
                <span className="font-bold bg-white/20 px-2 py-0.5 rounded">{formatMonthName(selectedMonth)}</span>
              </div>
            )}
            {dateRangeStart && dateRangeEnd && (
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="opacity-80">Range:</span> 
                <span className="font-bold bg-white/20 px-2 py-0.5 rounded">{dateRangeStart} to {dateRangeEnd}</span>
              </div>
            )}
            {selectedMember !== 'all' && (
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="opacity-80">Member:</span> 
                <span className="font-bold bg-white/20 px-2 py-0.5 rounded">{selectedMember}</span>
              </div>
            )}
            <div className="w-full mt-1 border-t border-white/20 pt-2 flex items-center gap-2">
              <span className="opacity-80 italic">Results:</span> 
              <span className="font-semibold underline decoration-2 underline-offset-4">
                Showing {totalRecords} member{totalRecords !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
