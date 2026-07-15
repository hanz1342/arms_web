import { RiskMatrixFilter } from '@/types';
import { api, bindRiskQuery, responseTransformer } from './api'
import { getHeaders } from './access-token';

export function getRiskMatrixCount(option?: RiskMatrixFilter) {
   const result =  api({
      method: "GET",
      headers: getHeaders(),
      url: `risks_matrix_count?${bindRiskQuery(option)}`
    });

   return responseTransformer(result);
}

export function getRiskMatrix(option?: RiskMatrixFilter) {
   const result =  api({
      method: "GET",
      headers: getHeaders(),
      url: `risks_matrix?${bindRiskQuery(option)}`
    });

   return responseTransformer(result);
}

export function getRiskSummaryDetail(option?: RiskMatrixFilter) {
   const result =  api({
      method: "GET",
      headers: getHeaders(),
      url: `risks_matrix_detail?${bindRiskQuery(option)}`
    });

   return responseTransformer(result);
}