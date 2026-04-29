/**
 * Dashboard Configuration
 * Update these values to customize your dashboard
 */

export const DASHBOARD_CONFIG = {
  // Google Sheet ID - Get this from your sheet URL
  GOOGLE_SHEET_ID: '1Qh4VMze8D64Wqbzz2UQo2zxsKYfMCZf_gzXaZVfa5Fg',
  
  // Date range for the dashboard
  START_DATE: '24-03-2026',
  END_DATE: '28-04-2026', // Updated to the latest available sheet for accuracy
  
  // Sheet naming format
  // Use 'DD-MM-YYYY' for dates like 24-03-2026
  SHEET_NAME_FORMAT: 'DD-MM-YYYY',
  
  // Performance score weights (must add up to 1.0)
  SCORE_WEIGHTS: {
    connectionAchievement: 0.25,
    messageAchievement: 0.20,
    leadConversionRate: 0.25,
    resumeAchievement: 0.15,
    dashboardUpdateRate: 0.15
  },
  
  // Thresholds for AI suggestions
  THRESHOLDS: {
    lowConnectionRate: 50,
    highConnectionRate: 150,
    lowMessageRate: 70,
    lowConversionRate: 20,
    highConversionRate: 40,
    lowResumeRate: 50,
    lowDashboardUpdateRate: 80,
    excellentOverallScore: 80,
    poorOverallScore: 50
  },
  
  // Auto-refresh interval (in milliseconds)
  // Set to 0 to disable auto-refresh
  AUTO_REFRESH_INTERVAL: 0, // 5 minutes = 300000
  
  // Chart colors
  COLORS: {
    primary: '#3b82f6',    // Blue
    secondary: '#8b5cf6',  // Purple
    success: '#10b981',    // Green
    warning: '#f59e0b',    // Orange
    danger: '#ef4444',     // Red
    info: '#06b6d4'        // Cyan
  }
};

/**
 * Generate date range between start and end dates
 */
export function generateDateRange(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  
  // Parse dates (DD-MM-YYYY format)
  const [startDay, startMonth, startYear] = startDate.split('-').map(Number);
  const [endDay, endMonth, endYear] = endDate.split('-').map(Number);
  
  const start = new Date(startYear, startMonth - 1, startDay);
  const end = new Date(endYear, endMonth - 1, endDay);
  
  let current = new Date(start);
  
  while (current <= end) {
    const day = String(current.getDate()).padStart(2, '0');
    const month = String(current.getMonth() + 1).padStart(2, '0');
    const year = current.getFullYear();
    
    dates.push(`${day}-${month}-${year}`);
    
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
}
