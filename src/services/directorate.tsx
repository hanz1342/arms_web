import { api, bindRiskQuery, getHeaders, responseTransformer } from '@/services';
import { DirectorateFilter } from '@/types/directorate';

export function getDirectorates(option?: DirectorateFilter) {
   const result = api({
      method: "GET",
      headers: getHeaders(),
      url: `directorates?${bindRiskQuery(option)}`,
   });

   return responseTransformer(result);
};

export function getDirectorateById(id: number) {
   const result = api({
      method: "GET",
      headers: getHeaders(),
      url: `directorates/${id}`,
   });

   return responseTransformer(result);
};

export function createDirectorate(data: any) {
   const result = api({
      method: "POST",
      headers: getHeaders(),
      url: 'directorates',
      data,
   });

   return responseTransformer(result);
};

export function updateDirectorateById(data: any, id: number) {
   const result = api({
      method: "PUT",
      headers: getHeaders(),
      url: `directorates/${id}`,
      data: data,
   });

   return responseTransformer(result);
};

export function deleteDirectorateById(id: number) {
   const result = api({
      method: "DELETE",
      headers: getHeaders(),
      url: `directorates/${id}`
   });

   return responseTransformer(result);
};