/**
 * Verification Service
 * 
 * Re-exports verification logic from lib/verification
 */

export { 
  runVerificationChecks, 
  getSeverityColor, 
  sortFlagsBySeverity 
} from '@/lib/verification';
export type { 
  VerificationFlag, 
  VerificationFlagSeverity, 
  VerificationInput 
} from '@/lib/verification';

