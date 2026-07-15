import { RiskCategoryFilter } from '@/types/risk-category';
import { api, bindRiskQuery, responseTransformer } from './api';
import { getHeaders } from './access-token';

export function getRiskCategory(option?: RiskCategoryFilter) {
   const result = api({
      method: "GET",
      headers: getHeaders(),
      url: `categories?${bindRiskQuery(option)}`,
   });

   return responseTransformer(result);
};

export function getRiskCategoryById(id: string) {
   const result = api({
      method: "GET",
      headers: getHeaders(),
      url: `categories/${id}`,
   });

   return responseTransformer(result);
};

export function createRiskCategory(data: any) {
   const result = api({
      method: "POST",
      headers: getHeaders(),
      url: 'categories',
      data
   });

   return responseTransformer(result);
};

export function updateRiskCategoryById(data: any, id: any) {
   const result = api({
      method: "PUT",
      headers: getHeaders(),
      url: `categories/${id}`,
      data
   });

   return responseTransformer(result);
};

export function deleteRiskCategoryById(id: any) {
   const result = api({
      method: "DELETE",
      headers: getHeaders(),
      url: `categories/${id}`
   });

   return responseTransformer(result);
};