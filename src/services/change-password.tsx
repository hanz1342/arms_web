import { ChangePasswordInterface } from "@/types";
import { getHeaders } from "./access-token";
import { api, responseTransformer } from "./api";

export function changePassword(data: ChangePasswordInterface) {
   const result = api({
      method: "POST",
      headers: getHeaders(),
      url: 'change_password',
      data,
   });
 
   return responseTransformer(result);
};

export function resetPassword(data: any) {
   const result = api({
      method: "POST",
      headers: getHeaders(),
      url: 'reset_password',
      data,
   });
 
   return responseTransformer(result);
};
