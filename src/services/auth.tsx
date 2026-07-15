import { api, responseTransformer } from './api';

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