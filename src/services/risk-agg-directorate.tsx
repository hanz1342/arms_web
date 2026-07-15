import { api, bindRiskQuery, responseTransformer } from './api'
import { getHeaders } from './access-token';
import { RiskAggregationFilter } from '@/types';

export function getRisksAggDirectorate(option?: RiskAggregationFilter) {
   const result =  api({
      method: "GET",
      headers: getHeaders(),
      url: `risks_agg_directorate?${bindRiskQuery(option)}`
   });

   return responseTransformer(result);
}

export function updateRiskAggDirectorate(data: any) {
   const result =  api({
      method: "PUT",
      headers: getHeaders(),
      url: `risks_agg_directorate/1`,
      data
   });

   return responseTransformer(result);
}

export function getRisksAggDirectorateByOption(option?: RiskAggregationFilter) {
   const result =  api({
      method: "GET",
      headers: getHeaders(),
      url: `get_risks_agg_directorate_by_options?${bindRiskQuery(option)}`
   });console.log(bindRiskQuery(option));

   return responseTransformer(result);
}