import { api, bindRiskQuery, getHeaders, responseTransformer } from '@/services';
import { DepartmentInterface, DepartmentFilter } from '@/types';

export function getDepartment(option?: DepartmentFilter) {
   const result = api({
      method: "GET",
      headers:getHeaders(),
      url: `departments?${bindRiskQuery(option)}`,
   });

   return responseTransformer(result);
};

export function getDepartmentById(id: number) {
   const result = api({
      method: "GET",
      headers: getHeaders(),
      url: `departments/${id}`,
   });

   return responseTransformer(result);
};

export function createDepartment(data: DepartmentInterface) {
   const result = api({
      method: "POST",
      headers: getHeaders(),
      url: 'departments',
      data,
   });

   return responseTransformer(result);
};

export function updateDepartmentById(data: DepartmentInterface, id: number) {
   const result = api({
      method: "PUT",
      headers: getHeaders(),
      url: `departments/${id}`,
      data: data,
   });

   return responseTransformer(result);
};

export function deleteDepartmentById(id: number) {
   const result = api({
      method: "DELETE",
      headers: getHeaders(),
      url: `departments/${id}`
   });

   return responseTransformer(result);
};