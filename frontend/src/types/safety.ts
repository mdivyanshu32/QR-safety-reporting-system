export type ReportType = 'TOOL' | 'PPE' | 'NEAR_MISS' | 'INCIDENT' | 'ACCIDENT';

export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ReportStatus = 'NEW' | 'UNDER_REVIEW' | 'ACTION_REQUIRED' | 'ACTION_TAKEN' | 'CLOSED';

export interface SafetyReport {
  id?: number;
  reportNumber: string;
  type: ReportType;
  employeeId?: string;
  employeeName?: string;
  employeePhone?: string;
  date?: string;
  time?: string;
  location?: string;
  division?: string;
  subdivision?: string;
  activity?: string;
  description?: string;
  severity?: SeverityLevel;
  status?: ReportStatus;
  createdAt?: string;

  // Tool
  toolType?: string;
  problemType?: string;

  // PPE
  ppeItem?: string;
  issueType?: string;

  // Near Miss
  potentialHazard?: string;

  // Shared
  immediateAction?: string;
  equipmentInvolved?: string;
  injured?: boolean;
  workStopped?: boolean;
  witnessDetails?: string;

  // Accident
  injuryOccurred?: boolean;
  bodyPart?: string;
  injuryType?: string;
  firstAid?: boolean;
  hospitalRequired?: boolean;
}

export interface ReportSubmissionPayload {
  type: ReportType;
  employeeId?: string;
  employeeName?: string;
  employeePhone?: string;
  date?: string;
  time?: string;
  location?: string;
  division?: string;
  subdivision?: string;
  activity?: string;
  description?: string;
  severity?: SeverityLevel;

  toolType?: string;
  problemType?: string;

  ppeItem?: string;
  issueType?: string;

  potentialHazard?: string;

  immediateAction?: string;
  equipmentInvolved?: string;
  injured?: boolean;
  workStopped?: boolean;
  witnessDetails?: string;

  injuryOccurred?: boolean;
  bodyPart?: string;
  injuryType?: string;
  firstAid?: boolean;
  hospitalRequired?: boolean;

  idCardImage?: string; // Base64
  evidenceImages?: string[]; // Base64 array
  rawVoiceTranscript?: string;
  structuredVoiceJson?: string;
}

export interface CorrectiveAction {
  id?: number;
  reportId?: number;
  rootCause?: string;
  correctiveAction?: string;
  preventiveAction?: string;
  remarks?: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface ReportDetailsResponse {
  report: SafetyReport;
  idCardImage?: string;
  evidenceImages?: string[];
  rawVoiceTranscript?: string;
  structuredVoiceJson?: string;
  correctiveAction?: CorrectiveAction;
}

export interface DashboardStats {
  totalReports: number;
  nearMissCount: number;
  incidentCount: number;
  accidentCount: number;
  ppeCount: number;
  toolCount: number;

  openReports: number;
  closedReports: number;
  actionRequiredReports: number;

  reportsByType: Record<string, number>;
  reportsByDivision: Record<string, number>;
  reportsByStatus: Record<string, number>;
  reportsBySeverity: Record<string, number>;
}
