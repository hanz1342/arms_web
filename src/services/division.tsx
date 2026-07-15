import { api, bindRiskQuery, getHeaders, responseTransformer } from '@/services';
import { DivisionFilter } from '@/types/division';

export function getDivisions(option?: DivisionFilter) {
   const result = api({
      method: "GET",
      headers: getHeaders(),
      url: `divisions?${bindRiskQuery(option)}`,
   });

   return responseTransformer(result);
};

export function getDivisionById(id: number) {
   const result = api({
      method: "GET",
      headers: getHeaders(),
      url: `divisions/${id}`,
   });

   return responseTransformer(result);
};

export function createDivision(data: any) {
   const result = api({
      method: "POST",
      headers: getHeaders(),
      url: 'divisions',
      data,
   });

   return responseTransformer(result);
};

export function updateDivisionById(data: any, id: number) {
   const result = api({
      method: "PUT",
      headers: getHeaders(),
      url: `divisions/${id}`,
      data: data,
   });

   return responseTransformer(result);
};

export function deleteDivisionById(id: number) {
   const result = api({
      method: "DELETE",
      headers: getHeaders(),
      url: `divisions/${id}`
   });

   return responseTransformer(result);
};