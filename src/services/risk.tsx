import { RiskDetailFilter } from '@/types/risk-detail';
import { api, bindRiskQuery, responseTransformer } from './api'
import { getHeaders } from './access-token';
import moment from 'moment';

export function getRisks(option?: RiskDetailFilter) {
   const result =  api({
      method: "GET",
      headers: getHeaders(),
      url: `risks?${bindRiskQuery(option)}`
   });

   return responseTransformer(result);
}

export function getRiskById(id: any, searchDraft?: boolean) {
   const result =  api({
      method: "GET",
      headers: getHeaders(),
      url: `risks/${id}?searchDraft=${searchDraft || ''}`
    });

   return responseTransformer(result);
}

export function createNewRisk(data: any) {
   const result =  api({
      method: "POST",
      headers: getHeaders(),
      url: "risks",
      data
    });

   return responseTransformer(result);
}

export function updateRiskById(data: any, id: any) {
   const result =  api({
      method: "PUT",
      headers: getHeaders(),
      url: `risks/${id}`,
      data
    });

   return responseTransformer(result);
}

export function markRiskActiveById(id: any) {
   const result =  api({
      method: "PUT",
      headers: getHeaders(),
      url: `mark_risk_as_active/${id}`
    });

   return responseTransformer(result);
}

export function markRiskCancelledById(id: any) {
   const result =  api({
      method: "PUT",
      headers: getHeaders(),
      url: `mark_risk_as_cancelled/${id}`
    });

   return responseTransformer(result);
}

export function cancelDraftById(id: any) {
   const result =  api({
      method: "PUT",
      headers: getHeaders(),
      url: `cancel_risk/${id}`
    });

   return responseTransformer(result);
}

export function downloadExcel(option: any) {
   return api({
      method: "POST",
      headers: getHeaders(),
      url: `risks_export?${bindRiskQuery(option)}`,
      data: option,
      // data: { orderByFields },
      responseType: 'blob'
    })
    .then(response => {
      // Create a Blob from the response data
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
      // Create a link element and trigger a download
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `RiskDetails_${moment().format('YYYYMMDDHHmmss')}.xlsx`;
      link.click();
    });
}