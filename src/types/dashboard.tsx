import { BaseFilter } from "./base-filter";

export interface RiskCount {

}

export interface DashboardState {

}

export interface DashboardFilter extends BaseFilter {
   fiscalYear?: string;
   quarter?: string;
   category?: string;
   department?: string;
   directorate?: string;
   division?: string;
   riskScoreType?: string;
   iRiskScore?: number;
   rRiskScore?: string;
   status?: string;
   impactStatus?: string;
   rmType?: string;
}