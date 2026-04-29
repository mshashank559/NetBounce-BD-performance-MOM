import { BDMemberPerformance } from '../types';
import { Trophy, TrendingDown, Lightbulb } from 'lucide-react';
import { generateAISuggestions } from '../utils/googleSheets';

interface PerformerCardProps {
  performer: BDMemberPerformance;
  type: 'top' | 'low';
}

export default function PerformerCard({ performer, type }: PerformerCardProps) {
  const suggestions = generateAISuggestions(performer);
  const isTop = type === 'top';

  return (
    <div className={`rounded-xl p-6 ${isTop ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200' : 'bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200'}`}>
      <div className="flex items-center gap-3 mb-4">
        {isTop ? (
          <Trophy className="w-8 h-8 text-green-600" />
        ) : (
          <TrendingDown className="w-8 h-8 text-red-600" />
        )}
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            {isTop ? '🏆 Top Performer' : '📉 Needs Improvement'}
          </h3>
          <p className="text-2xl font-bold text-gray-800 mt-1">{performer.bdMember}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white/60 rounded-lg p-3">
          <p className="text-xs text-gray-600">Overall Score</p>
          <p className={`text-2xl font-bold ${isTop ? 'text-green-600' : 'text-red-600'}`}>
            {performer.metrics.overallScore.toFixed(1)}%
          </p>
        </div>
        <div className="bg-white/60 rounded-lg p-3">
          <p className="text-xs text-gray-600">Conversion Rate</p>
          <p className="text-2xl font-bold text-gray-800">
            {performer.metrics.leadConversionRate.toFixed(1)}%
          </p>
        </div>
        <div className="bg-white/60 rounded-lg p-3">
          <p className="text-xs text-gray-600">Connections</p>
          <p className="text-lg font-semibold text-gray-800">
            {performer.totalConnections}/{performer.connectionTarget}
          </p>
        </div>
        <div className="bg-white/60 rounded-lg p-3">
          <p className="text-xs text-gray-600">Leads</p>
          <p className="text-lg font-semibold text-gray-800">
            {performer.leadsReverted}
          </p>
        </div>
      </div>

      <div className="bg-white/60 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="w-4 h-4 text-yellow-600" />
          <p className="text-xs font-semibold text-gray-700">AI Suggestions</p>
        </div>
        <ul className="space-y-1">
          {suggestions.slice(0, 3).map((suggestion, idx) => (
            <li key={idx} className="text-xs text-gray-700">
              {suggestion}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
