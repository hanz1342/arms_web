import { api, responseTransformer } from './api';
import { getHeaders } from './access-token';

export function login(data: any) {
   const result = api({
      method: "POST",
      headers: {
         'Content-Type': 'application/json'
      },
      url: 'login',
      data
   });

   return responseTransformer(result);
}

export function getScopes() {
   const result = api({
      method: "POST",
      headers: getHeaders(),
      url: 'me',
   });

   return responseTransformer(result);
}