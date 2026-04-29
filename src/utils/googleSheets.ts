import { BDMemberData, BDMemberPerformance, PerformanceMetrics, DateWiseData, MonthWiseData } from '../types';
import { DASHBOARD_CONFIG, generateDateRange } from '../config/dashboard';

const SHEET_ID = DASHBOARD_CONFIG.GOOGLE_SHEET_ID;

// Cache for fallback data detection
let fallbackDataContent: string | null = null;

async function getFallbackData(): Promise<string | null> {
  if (fallbackDataContent !== null) return fallbackDataContent;
  try {
    // Fetch a non-existent sheet to see what Google returns as fallback
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=NON_EXISTENT_SHEET_FOR_DETECTION`;
    const response = await fetch(url);
    if (response.ok) {
      fallbackDataContent = await response.text();
    }
  } catch (e) {
    console.error('Failed to fetch fallback canary:', e);
  }
  return fallbackDataContent;
}

// Fallback demo data in case of CORS or network issues
const DEMO_DATA: BDMemberData[] = [
  {
    bdMember: 'Rajveer',
    connectionTarget: 20,
    totalConnections: 120,
    messageTarget: 10,
    totalMessagesSent: 95,
    revertedMessageTarget: 10,
    leadsReverted: 42,
    resumeTarget: 15,
    resumeTargetAchieved: 18,
    leadsUpdatedInDashboard: 40,
    date: '24-03-2026 to 21-04-2026'
  },
  {
    bdMember: 'Karan',
    connectionTarget: 20,
    totalConnections: 85,
    messageTarget: 10,
    totalMessagesSent: 72,
    revertedMessageTarget: 10,
    leadsReverted: 28,
    resumeTarget: 15,
    resumeTargetAchieved: 12,
    leadsUpdatedInDashboard: 25,
    date: '24-03-2026 to 21-04-2026'
  },
  {
    bdMember: 'Kartik',
    connectionTarget: 20,
    totalConnections: 110,
    messageTarget: 10,
    totalMessagesSent: 88,
    revertedMessageTarget: 10,
    leadsReverted: 35,
    resumeTarget: 15,
    resumeTargetAchieved: 16,
    leadsUpdatedInDashboard: 33,
    date: '24-03-2026 to 21-04-2026'
  },
  {
    bdMember: 'Harsh',
    connectionTarget: 20,
    totalConnections: 95,
    messageTarget: 10,
    totalMessagesSent: 80,
    revertedMessageTarget: 10,
    leadsReverted: 30,
    resumeTarget: 15,
    resumeTargetAchieved: 14,
    leadsUpdatedInDashboard: 28,
    date: '24-03-2026 to 21-04-2026'
  },
  {
    bdMember: 'Dewang',
    connectionTarget: 20,
    totalConnections: 105,
    messageTarget: 10,
    totalMessagesSent: 85,
    revertedMessageTarget: 10,
    leadsReverted: 32,
    resumeTarget: 15,
    resumeTargetAchieved: 15,
    leadsUpdatedInDashboard: 30,
    date: '24-03-2026 to 21-04-2026'
  },
  {
    bdMember: 'Lakshraj',
    connectionTarget: 20,
    totalConnections: 65,
    messageTarget: 10,
    totalMessagesSent: 58,
    revertedMessageTarget: 10,
    leadsReverted: 18,
    resumeTarget: 15,
    resumeTargetAchieved: 8,
    leadsUpdatedInDashboard: 16,
    date: '24-03-2026 to 21-04-2026'
  },
  {
    bdMember: 'Harshit',
    connectionTarget: 20,
    totalConnections: 78,
    messageTarget: 10,
    totalMessagesSent: 65,
    revertedMessageTarget: 10,
    leadsReverted: 22,
    resumeTarget: 15,
    resumeTargetAchieved: 10,
    leadsUpdatedInDashboard: 20,
    date: '24-03-2026 to 21-04-2026'
  }
];

export async function fetchSheetData(sheetName: string): Promise<BDMemberData[]> {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
    const response = await fetch(url);
    
    // Check if the request was successful
    if (!response.ok) return [];
    
    const text = await response.text();
    
    // Check if this is the fallback sheet (Google serves the first sheet if name is not found)
    const fallback = await getFallbackData();
    if (fallback && text === fallback) {
      // If the sheet we requested is actually the first sheet, we allow it
      // But if it's NOT the first sheet in the spreadsheet, it's a false positive fallback
      if (sheetName !== DASHBOARD_CONFIG.START_DATE) {
        return [];
      }
    }

    // Google gviz API often returns an HTML error page or a "not found" message
    if (text.includes('<!DOCTYPE html') || text.includes('invalid_query') || text.includes('not_found')) {
      return [];
    }
    
    // If the sheet doesn't exist, Google sometimes returns the first sheet instead of an error.
    // This is hard to detect with CSV, but we can check if the first row looks like our headers.
    const firstLine = text.split('\n')[0]?.toLowerCase() || '';
    if (!firstLine.includes('member') && !firstLine.includes('connection')) {
      return [];
    }

    return parseCSVData(text, sheetName);
  } catch (error) {
    console.error(`Error fetching sheet ${sheetName}:`, error);
    return [];
  }
}

function parseCSVData(csv: string, date: string): BDMemberData[] {
  const lines = csv.split('\n').filter(line => line.trim());
  if (lines.length < 2) return [];
  
  // Skip headers
  parseCSVLine(lines[0]);
  const data: BDMemberData[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (!values[0] || values[0].trim() === '') continue;
    
    const memberData: BDMemberData = {
      bdMember: values[0]?.replace(/"/g, '').trim() || '',
      connectionTarget: parseNumber(values[1]),
      totalConnections: parseNumber(values[2]),
      messageTarget: parseNumber(values[3]),
      totalMessagesSent: parseNumber(values[4]),
      revertedMessageTarget: parseNumber(values[5]),
      leadsReverted: parseNumber(values[6]),
      resumeTarget: parseNumber(values[7]) || 0,
      resumeTargetAchieved: parseNumber(values[8]) || 0,
      leadsUpdatedInDashboard: parseNumber(values[9]) || 0,
      date: date
    };
    
    if (memberData.bdMember) {
      data.push(memberData);
    }
  }
  
  return data;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  
  return result.map(val => val.replace(/^"|"$/g, '').trim());
}

function parseNumber(value: string | undefined): number {
  if (!value || value === '' || value === '""') return 0;
  const cleaned = value.replace(/"/g, '').trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

export async function fetchAllData(): Promise<BDMemberData[]> {
  try {
    const allData: BDMemberData[] = [];
    
    // Generate date range fresh from config
    const sheetDates = generateDateRange(
      DASHBOARD_CONFIG.START_DATE, 
      DASHBOARD_CONFIG.END_DATE
    );
    
    // Try to fetch from the first sheet to test connectivity
    // If START_DATE fails, try to find the first available sheet in the range
    let testData: BDMemberData[] = [];
    let firstValidIndex = -1;
    
    for (let i = 0; i < Math.min(sheetDates.length, 5); i++) {
      testData = await fetchSheetData(sheetDates[i]);
      if (testData.length > 0) {
        firstValidIndex = i;
        break;
      }
    }
    
    if (testData.length === 0 && firstValidIndex === -1) {
      console.warn('No data fetched from Google Sheets, using demo data');
      return DEMO_DATA;
    }
    
    // Fetch all sheets in the range
    for (let i = 0; i < sheetDates.length; i++) {
      // Skip the one we already fetched
      if (i === firstValidIndex) {
        allData.push(...testData);
        continue;
      }
      const sheetData = await fetchSheetData(sheetDates[i]);
      allData.push(...sheetData);
    }
    
    return allData.length > 0 ? allData : DEMO_DATA;
  } catch (error) {
    console.error('Error fetching all data, using demo data:', error);
    return DEMO_DATA;
  }
}

export function calculateMetrics(data: BDMemberData): PerformanceMetrics {
  // Calculate raw achievements and cap at 100% as requested
  const connectionAchievement = Math.min(
    data.connectionTarget > 0 ? (data.totalConnections / data.connectionTarget) * 100 : 0,
    100
  );
    
  const messageAchievement = Math.min(
    data.messageTarget > 0 ? (data.totalMessagesSent / data.messageTarget) * 100 : 0,
    100
  );
    
  const leadConversionRate = Math.min(
    data.totalMessagesSent > 0 ? (data.leadsReverted / data.totalMessagesSent) * 100 : 0,
    100
  );
    
  const resumeAchievement = Math.min(
    data.resumeTarget > 0 ? (data.resumeTargetAchieved / data.resumeTarget) * 100 : 0,
    100
  );
    
  const dashboardUpdateRate = Math.min(
    data.leadsReverted > 0 ? (data.leadsUpdatedInDashboard / data.leadsReverted) * 100 : 0,
    100
  );
  
  // Overall score: weighted average of metrics (already capped)
  const weights = DASHBOARD_CONFIG.SCORE_WEIGHTS;
  const overallScore = (
    connectionAchievement * weights.connectionAchievement +
    messageAchievement * weights.messageAchievement +
    leadConversionRate * weights.leadConversionRate +
    resumeAchievement * weights.resumeAchievement +
    dashboardUpdateRate * weights.dashboardUpdateRate
  );
  
  return {
    connectionAchievement,
    messageAchievement,
    leadConversionRate,
    resumeAchievement,
    dashboardUpdateRate,
    overallScore: Math.min(overallScore, 100)
  };
}

export function aggregateMemberData(allData: BDMemberData[]): BDMemberPerformance[] {
  const memberMap = new Map<string, BDMemberData>();
  
  allData.forEach(data => {
    const existing = memberMap.get(data.bdMember);
    if (!existing) {
      memberMap.set(data.bdMember, { ...data });
    } else {
      // Aggregate data
      existing.totalConnections += data.totalConnections;
      existing.totalMessagesSent += data.totalMessagesSent;
      existing.leadsReverted += data.leadsReverted;
      existing.resumeTargetAchieved += data.resumeTargetAchieved;
      existing.leadsUpdatedInDashboard += data.leadsUpdatedInDashboard;
      
      // Sum up targets for accurate percentage calculation over multiple days
      existing.connectionTarget += data.connectionTarget || 0;
      existing.messageTarget += data.messageTarget || 0;
      existing.revertedMessageTarget += data.revertedMessageTarget || 0;
      existing.resumeTarget += data.resumeTarget || 0;
    }
  });
  
  return Array.from(memberMap.values()).map(data => ({
    ...data,
    metrics: calculateMetrics(data)
  }));
}

export function generateAISuggestions(performance: BDMemberPerformance): string[] {
  const suggestions: string[] = [];
  const { metrics, bdMember } = performance;
  const thresholds = DASHBOARD_CONFIG.THRESHOLDS;
  
  // Specific Improvement Parameters
  if (metrics.connectionAchievement < thresholds.lowConnectionRate) {
    suggestions.push(`🎯 Priority: Increase daily connections. ${bdMember}, your volume is below ${thresholds.lowConnectionRate}% of target. Aim for 20+ per day.`);
  } else if (metrics.connectionAchievement > thresholds.highConnectionRate) {
    suggestions.push('🔍 Quality Focus: Connection volume is high. Spend more time researching profiles to ensure higher quality leads.');
  }
  
  if (metrics.messageAchievement < thresholds.lowMessageRate) {
    suggestions.push(`💬 Outreach Gap: Message achievement is low (${metrics.messageAchievement.toFixed(1)}%). Try to maintain a consistent flow of follow-ups.`);
  }
  
  if (metrics.leadConversionRate < thresholds.lowConversionRate) {
    suggestions.push('📈 Strategy Change: Lead conversion is below par. Focus on personalizing the first 2 lines of your messages to improve response rates.');
  } else if (metrics.leadConversionRate > thresholds.highConversionRate) {
    suggestions.push('⭐ Top Strategy: Your messaging technique is highly effective. Share your personalization tips with the team.');
  }
  
  if (metrics.resumeAchievement < thresholds.lowResumeRate) {
    suggestions.push('📄 Follow-up Parameter: Focus on the "Call to Action". Ensure you are explicitly asking for resumes once a lead shows interest.');
  }
  
  if (metrics.dashboardUpdateRate < thresholds.lowDashboardUpdateRate) {
    suggestions.push('📊 CRM Hygiene: Improve dashboard reporting. Every lead reverted MUST be logged to ensure accurate tracking.');
  }
  
  // Performance recognition
  if (metrics.overallScore >= thresholds.excellentOverallScore) {
    suggestions.push(`🏆 Elite Performance: Maintaining ${metrics.overallScore.toFixed(1)}% score. Keep up the high standards across all parameters.`);
  } else if (metrics.overallScore < thresholds.poorOverallScore) {
    suggestions.push('⚡ Action Required: Overall score is low. Schedule a strategy review to optimize your outreach funnel.');
  }
  
  if (suggestions.length === 0) {
    suggestions.push('✅ Consistency: Good performance. Maintain your current rhythm and focus on incremental gains.');
  }
  
  return suggestions;
}

export function groupByDate(allData: BDMemberData[]): DateWiseData[] {
  const dateMap = new Map<string, BDMemberData[]>();
  
  allData.forEach(data => {
    if (!dateMap.has(data.date)) {
      dateMap.set(data.date, []);
    }
    dateMap.get(data.date)!.push(data);
  });
  
  const dateWiseData: DateWiseData[] = [];
  
  dateMap.forEach((members, date) => {
    const performanceMembers = members.map(m => ({
      ...m,
      metrics: calculateMetrics(m)
    }));
    
    const totals = {
      connections: members.reduce((sum, m) => sum + m.totalConnections, 0),
      messages: members.reduce((sum, m) => sum + m.totalMessagesSent, 0),
      leads: members.reduce((sum, m) => sum + m.leadsReverted, 0),
      resumes: members.reduce((sum, m) => sum + m.resumeTargetAchieved, 0)
    };
    
    dateWiseData.push({
      date,
      members: performanceMembers,
      totals
    });
  });
  
  // Sort by date
  return dateWiseData.sort((a, b) => {
    const [dayA, monthA, yearA] = a.date.split('-').map(Number);
    const [dayB, monthB, yearB] = b.date.split('-').map(Number);
    const dateA = new Date(yearA, monthA - 1, dayA);
    const dateB = new Date(yearB, monthB - 1, dayB);
    return dateA.getTime() - dateB.getTime();
  });
}

export function groupByMonth(allData: BDMemberData[]): MonthWiseData[] {
  const monthMap = new Map<string, BDMemberData[]>();
  
  allData.forEach(data => {
    // Extract month-year from date (DD-MM-YYYY -> MM-YYYY)
    const parts = data.date.split('-');
    const month = parts.length >= 2 ? `${parts[1]}-${parts[2]}` : data.date;
    
    if (!monthMap.has(month)) {
      monthMap.set(month, []);
    }
    monthMap.get(month)!.push(data);
  });
  
  const monthWiseData: MonthWiseData[] = [];
  
  monthMap.forEach((allMembers, month) => {
    // Aggregate by member within the month
    const memberMap = new Map<string, BDMemberData>();
    
    allMembers.forEach(data => {
      const existing = memberMap.get(data.bdMember);
      if (!existing) {
        memberMap.set(data.bdMember, { ...data });
      } else {
        existing.totalConnections += data.totalConnections;
        existing.totalMessagesSent += data.totalMessagesSent;
        existing.leadsReverted += data.leadsReverted;
        existing.resumeTargetAchieved += data.resumeTargetAchieved;
        existing.leadsUpdatedInDashboard += data.leadsUpdatedInDashboard;
        
        // Sum up targets for accurate monthly calculation
        existing.connectionTarget += data.connectionTarget || 0;
        existing.messageTarget += data.messageTarget || 0;
        existing.revertedMessageTarget += data.revertedMessageTarget || 0;
        existing.resumeTarget += data.resumeTarget || 0;
      }
    });
    
    const performanceMembers = Array.from(memberMap.values()).map(m => ({
      ...m,
      metrics: calculateMetrics(m)
    }));
    
    const totals = {
      connections: allMembers.reduce((sum, m) => sum + m.totalConnections, 0),
      messages: allMembers.reduce((sum, m) => sum + m.totalMessagesSent, 0),
      leads: allMembers.reduce((sum, m) => sum + m.leadsReverted, 0),
      resumes: allMembers.reduce((sum, m) => sum + m.resumeTargetAchieved, 0)
    };
    
    monthWiseData.push({
      month,
      members: performanceMembers,
      totals
    });
  });
  
  // Sort by month
  return monthWiseData.sort((a, b) => {
    const [monthA, yearA] = a.month.split('-').map(Number);
    const [monthB, yearB] = b.month.split('-').map(Number);
    const dateA = new Date(yearA, monthA - 1);
    const dateB = new Date(yearB, monthB - 1);
    return dateA.getTime() - dateB.getTime();
  });
}

export function getUniqueDates(allData: BDMemberData[]): string[] {
  const dates = new Set(allData.map(d => d.date));
  return Array.from(dates).sort((a, b) => {
    const [dayA, monthA, yearA] = a.split('-').map(Number);
    const [dayB, monthB, yearB] = b.split('-').map(Number);
    const dateA = new Date(yearA, monthA - 1, dayA);
    const dateB = new Date(yearB, monthB - 1, dayB);
    return dateA.getTime() - dateB.getTime();
  });
}

export function getUniqueMonths(allData: BDMemberData[]): string[] {
  const months = new Set(allData.map(d => {
    const parts = d.date.split('-');
    return parts.length >= 2 ? `${parts[1]}-${parts[2]}` : d.date;
  }));
  return Array.from(months).sort((a, b) => {
    const [monthA, yearA] = a.split('-').map(Number);
    const [monthB, yearB] = b.split('-').map(Number);
    const dateA = new Date(yearA, monthA - 1);
    const dateB = new Date(yearB, monthB - 1);
    return dateA.getTime() - dateB.getTime();
  });
}

export function formatMonthName(monthYear: string): string {
  const [month, year] = monthYear.split('-').map(Number);
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${monthNames[month - 1]} ${year}`;
}
