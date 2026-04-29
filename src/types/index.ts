export interface BDMemberData {
  bdMember: string;
  connectionTarget: number;
  totalConnections: number;
  messageTarget: number;
  totalMessagesSent: number;
  revertedMessageTarget: number;
  leadsReverted: number;
  resumeTarget: number;
  resumeTargetAchieved: number;
  leadsUpdatedInDashboard: number;
  date: string;
}

export interface PerformanceMetrics {
  connectionAchievement: number;
  messageAchievement: number;
  leadConversionRate: number;
  resumeAchievement: number;
  dashboardUpdateRate: number;
  overallScore: number;
}

export interface BDMemberPerformance extends BDMemberData {
  metrics: PerformanceMetrics;
}

export interface DateWiseData {
  date: string;
  members: BDMemberPerformance[];
  totals: {
    connections: number;
    messages: number;
    leads: number;
    resumes: number;
  };
}

export interface MonthWiseData {
  month: string;
  members: BDMemberPerformance[];
  totals: {
    connections: number;
    messages: number;
    leads: number;
    resumes: number;
  };
}
