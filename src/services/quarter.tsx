import { api, bindRiskQuery, getHeaders, responseTransformer } from '@/services';
import { QuarterFilter } from '@/types/quarter';

export function getQuarters(option?: QuarterFilter) {
   const result = api({
      method: "GET",
      headers:getHeaders(),
      url: `cycles?${bindRiskQuery(option)}`,
   });

   return responseTransformer(result);
};

export function getAllQuarters(option?: QuarterFilter) {
   const result = api({
      method: "GET",
      headers:getHeaders(),
      url: `all_cycles?${bindRiskQuery(option)}`,
   });

   return responseTransformer(result);
};

export function getQuarterById(id: number) {
   const result = api({
      method: "GET",
      headers: getHeaders(),
      url: `cycles/${id}`,
   });

   return responseTransformer(result);
};

export function createQuarter(data: any) {
   const result = api({
      method: "POST",
      headers: getHeaders(),
      url: 'cycles',
      data,
   });

   return responseTransformer(result);
};

export function updateQuarterById(data: any, id: number) {
   const result = api({
      method: "PUT",
      headers: getHeaders(),
      url: `cycles/${id}`,
      data: data,
   });

   return responseTransformer(result);
};

export function deleteQuarterById(id: number) {
   const result = api({
      method: "DELETE",
      headers: getHeaders(),
      url: `cycles/${id}`
   });

   return responseTransformer(result);
};