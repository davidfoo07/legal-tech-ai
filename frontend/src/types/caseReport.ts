import type { User } from './user';

export interface CaseReport {
  id: string;
  user: User;
  report: string; // JSON string
  status: 'OPEN' | 'UNDER_REVIEW' | 'CONTACTED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  amountInvolved: number; // Decimal
  createdAt: string; // ISO date string
}

export interface ParsedCaseReport {
  damages: {
    desiredOutcome: string;
    estimatedAmount: number; // 5400 is a number
  };
  evidence: {
    documentsMentioned: string[];
  };
  clientInfo: {
    email: string;
    phone: string;
    fullName: string;
  };
  caseDetails: {
    caseType: string;
    keyFacts: string[];
    priority: string; // "MEDIUM"
    incidentSummary: string;
  };
  employmentDetails: {
    endDate: string; // "YYYY-MM-DD"
    jobTitle: string;
    startDate: string; // "YYYY-MM-DD"
    employerName: string;
  };
}

export interface WhatsappApiPayload {
  recipientName: string;
  caseTitle: string;
  phoneNumber: string;
  firmName: string;
  lawyerName: string;
}
