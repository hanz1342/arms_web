import { BaseFilter } from "./base-filter";

export interface RiskDetailFilter extends BaseFilter {
   riskId?: string;
   riskEvent?: string;
   fiscalYear?: string;
   quarter?: string;
   category?: string;
   department?: string;
   directorate?: string;
   division?: string;
   aggFlag?: string;
   riskStatus?: string;
   riskStatuses?: string[];
   inherentRiskScoreDes?: string;
   residualRiskScoreDes?: string;
}