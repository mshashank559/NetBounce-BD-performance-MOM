import { BDMemberPerformance } from '../types';
import { User, Target, MessageSquare, FileText, TrendingUp } from 'lucide-react';
import { generateAISuggestions } from '../utils/googleSheets';

interface MemberDetailCardProps {
  member: BDMemberPerformance;
}

export default function MemberDetailCard({ member }: MemberDetailCardProps) {
  const suggestions = generateAISuggestions(member);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-lg">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{member.bdMember}</h3>
            <p className="text-sm text-gray-500">BD Team Member</p>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-lg ${getScoreColor(member.metrics.overallScore)}`}>
          <p className="text-xs font-semibold">Overall Score</p>
          <p className="text-2xl font-bold">{member.metrics.overallScore.toFixed(1)}%</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-blue-600" />
            <p className="text-xs font-semibold text-blue-900">Connections</p>
          </div>
          <p className="text-lg font-bold text-blue-600">
            {member.totalConnections}<span className="text-sm text-gray-600">/{member.connectionTarget}</span>
          </p>
          <p className="text-xs text-blue-700 mt-1">
            {member.metrics.connectionAchievement.toFixed(0)}% achieved
          </p>
        </div>

        <div className="bg-purple-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="w-4 h-4 text-purple-600" />
            <p className="text-xs font-semibold text-purple-900">Messages</p>
          </div>
          <p className="text-lg font-bold text-purple-600">
            {member.totalMessagesSent}<span className="text-sm text-gray-600">/{member.messageTarget}</span>
          </p>
          <p className="text-xs text-purple-700 mt-1">
            {member.metrics.messageAchievement.toFixed(0)}% achieved
          </p>
        </div>

        <div className="bg-green-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <p className="text-xs font-semibold text-green-900">Leads</p>
          </div>
          <p className="text-lg font-bold text-green-600">
            {member.leadsReverted}<span className="text-sm text-gray-600">/{member.revertedMessageTarget}</span>
          </p>
          <p className="text-xs text-green-700 mt-1">
            {member.metrics.leadConversionRate.toFixed(1)}% conversion
          </p>
        </div>

        <div className="bg-orange-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-4 h-4 text-orange-600" />
            <p className="text-xs font-semibold text-orange-900">Resumes</p>
          </div>
          <p className="text-lg font-bold text-orange-600">
            {member.resumeTargetAchieved}<span className="text-sm text-gray-600">/{member.resumeTarget}</span>
          </p>
          <p className="text-xs text-orange-700 mt-1">
            {member.resumeTarget > 0 ? member.metrics.resumeAchievement.toFixed(0) : 0}% achieved
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4">
        <p className="text-sm font-semibold text-gray-700 mb-2">💡 AI-Powered Suggestions:</p>
        <ul className="space-y-1">
          {suggestions.map((suggestion, idx) => (
            <li key={idx} className="text-xs text-gray-700 flex items-start gap-2">
              <span className="text-indigo-600 font-bold">•</span>
              <span>{suggestion}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
