export interface RiskAggregationFilter {
   fiscalYear?: string | number;
   quarter?: string;
   directorate?: string;
   department?: string;
   riskStatus?: string;
   riskCategoryL1?: string;
   riskCategoryL2?: string;
   riskCategoryL3?: string;
   page?: number;
   pageSize?: number;
}