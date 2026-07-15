import { RiskCategoryFilter } from '@/types/risk-category';
import { api, bindRiskQuery, responseTransformer } from './api';
import { getHeaders } from './access-token';

export function getImpactCategory(option?: RiskCategoryFilter) {
   const result = api({
      method: "GET",
      headers: getHeaders(),
      url: `impact_categories?${bindRiskQuery(option)}`,
   });

   return responseTransformer(result);
};

export function getImpactCategoryById(id: any) {
   const result = api({
      method: "GET",
      headers: getHeaders(),
      url: `impact_categories/${id}`,
   });

   return responseTransformer(result);
};

export function createImpactCategory(data: any) {
   const result = api({
      method: "POST",
      headers: getHeaders(),
      url: 'impact_categories',
      data
   });

   return responseTransformer(result);
};

export function updateImpactCategoryById(data: any, id: any) {
   const result = api({
      method: "PUT",
      headers: getHeaders(),
      url: `impact_categories/${id}`,
      data
   });

   return responseTransformer(result);
};

export function deleteImpactCategoryById(id: number) {
   const result = api({
      method: "DELETE",
      headers: getHeaders(),
      url: `impact_categories/${id}`
   });

   return responseTransformer(result);
};