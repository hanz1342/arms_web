import { api, bindRiskQuery, getHeaders, responseTransformer } from '@/services';
import { RoleInterface, RoleFilter } from '@/types';

export function getRoles(option?: RoleFilter) {
   const result = api({
      method: "GET",
      headers: getHeaders(),
      url: `roles?${bindRiskQuery(option)}`,
   });

   return responseTransformer(result);
};

export function getRoleById(id: number) {
   const result = api({
      method: "GET",
      headers: getHeaders(),
      url: `roles/${id}`,
   });

   return responseTransformer(result);
};

export function createRole(data: RoleInterface) {
   const result = api({
      method: "POST",
      headers: getHeaders(),
      url: 'roles',
      data,
   });

   return responseTransformer(result);
};

export function updateRoleById(data: RoleInterface, id: number) {
   const result = api({
      method: "PUT",
      headers: getHeaders(),
      url: `roles/${id}`,
      data: data,
   });

   return responseTransformer(result);
};

export function deleteRoleById(id: number) {
   const result = api({
      method: "DELETE",
      headers: getHeaders(),
      url: `roles/${id}`
   });

   return responseTransformer(result);
};