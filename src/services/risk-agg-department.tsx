import { api, bindRiskQuery, responseTransformer } from './api'
import { getHeaders } from './access-token';
import { RiskAggregationFilter } from '@/types';

export function getRisksAggDepartment(option?: RiskAggregationFilter) {
   const result =  api({
      method: "GET",
      headers: getHeaders(),
      url: `risks_agg_department?${bindRiskQuery(option)}`
   });

   return responseTransformer(result);
}

export function updateRiskAggDepartment(data: any) {
   const result =  api({
      method: "PUT",
      headers: getHeaders(),
      url: `risks_agg_department/1`,
      data
   });

   return responseTransformer(result);
}