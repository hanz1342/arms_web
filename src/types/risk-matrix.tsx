import { BaseFilter } from "./base-filter";

export interface RiskMatrixFilter extends BaseFilter {
   fiscalYear?: string;
   quarter?: string;
   category?: string;
   department?: string;
   directorate?: string;
   division?: string;
   aggFlag?: string;
   riskScoreType?: string;
   iRiskScore?: number;
   rRiskScore?: number;
}