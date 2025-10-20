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
