import { EmployeeFilter } from '@/types/employee';
import { api, bindRiskQuery, responseTransformer } from './api'
import { getHeaders } from './access-token';

export function getEmployees(option?: EmployeeFilter) {
   const result = api({
      method: "GET",
      headers: getHeaders(),
      url: `employees?${bindRiskQuery(option)}`
   });
   return responseTransformer(result);
}

export function getEmployeeById(id: string) {
   const result = api({
      method: "GET",
      headers: getHeaders(),
      url: `employees/${id}`
   });

   return responseTransformer(result);
}

export function createNewEmployee(data: any) {
   const result = api({
      method: "POST",
      headers: getHeaders(),
      url: 'employees',
      data
   });

   return responseTransformer(result);
}

export function updateEmployeeById(data: any, id: any) {
   const result = api({
      method: "PUT",
      headers: getHeaders(),
      url: `employees/${id}`,
      data: data,
   });

   return responseTransformer(result);
}