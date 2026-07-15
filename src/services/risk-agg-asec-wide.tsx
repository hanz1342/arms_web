import { api, bindRiskQuery, responseTransformer } from './api'
import { getHeaders } from './access-token';
import { RiskAggregationFilter } from '@/types';

export function getRisksAggASECWide(option?: RiskAggregationFilter) {
   const result =  api({
      method: "GET",
      headers: getHeaders(),
      url: `risks_agg_asec_wide?${bindRiskQuery(option)}`
   });

   return responseTransformer(result);
}

export function updateRiskAggASECWide(data: any) {
   const result =  api({
      method: "PUT",
      headers: getHeaders(),
      url: `risks_agg_asec_wide/1`,
      data
   });

   return responseTransformer(result);
}