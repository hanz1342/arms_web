import { DashboardFilter } from '@/types/dashboard';
import { api, responseTransformer, bindRiskQuery } from './api';
import { getHeaders } from './access-token';

export function getDashboardData(option?: DashboardFilter) {
   const result = api({
      method: "GET",
      headers: getHeaders(),
      url: `dashboard?${bindRiskQuery(option)}`
   });

   return responseTransformer(result);
};

export function getSelectOptions() {
   const result = api({
      method: "GET",
      headers: getHeaders(),
      url: 'dashboard/select_options'
   });

   return responseTransformer(result);
};

export function getRiskCount(option?: DashboardFilter) {
   const result = api({
      method: "GET",
      headers: getHeaders(),
      url: `dashboard/risk_count?${bindRiskQuery(option)}`
   });

   return responseTransformer(result);
};

export function getRiskSummary(option?: DashboardFilter) {
   const result = api({
      method: "GET",
      headers: getHeaders(),
      url: `dashboard/risk_summaries?${bindRiskQuery(option)}`
   });

   return responseTransformer(result);
};

export function getRiskDetail(option?: DashboardFilter) {
   const result = api({
      method: "GET",
      headers: getHeaders(),
      url: `dashboard/risk_treatment_details?${bindRiskQuery(option)}`
   });

   return responseTransformer(result);
};