import { getHeaders } from './access-token';
import { api, responseTransformer } from './api';

export function getEmployeeSelectOptions() {
   const result = api({
      method: "GET",
      headers: getHeaders(),
      url: 'employee/select_options'
   });

   return responseTransformer(result);
}

export function getRoleSelectOptions() {
   const result = api({
      method: "GET",
      headers: getHeaders(),
      url: 'roles/select_options'
   });

   return responseTransformer(result);
}

export function getRiskSelectOptions() {
   const result = api({
      method: "GET",
      headers: getHeaders(),
      url: 'risks/select_options'
   });

   return responseTransformer(result);
}

export function getCategoriesLevel1() {
   const result = api({
      method: "GET",
      headers: getHeaders(),
      url: 'categories_level1'
   });

   return responseTransformer(result);
}

export function getCategoriesLevel2(level1: string) {
   const result = api({
      method: "GET",
      headers: getHeaders(),
      url: `categories_level2?level1=${level1}`
   });

   return responseTransformer(result);
}

export function getCategoriesLevel3(level2: string) {
   const result = api({
      method: "GET",
      headers: getHeaders(),
      url: `categories_level3?level2=${level2}`
   });

   return responseTransformer(result);
}

