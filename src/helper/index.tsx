import { RiskCause } from "@/models";
import moment from 'moment';
import { getCookie } from 'cookies-next';
import Swal from "sweetalert2";
import { Permission } from "@/types/privilege";

/**
 * The Singleton class defines the `getInstance` method that lets clients access
 * the unique singleton instance.
 */
export default class Helper {
   private static instance: Helper;

   /**
    * The Singleton's constructor should always be private to prevent direct
    * construction calls with the `new` operator.
    */
   private constructor() { }

   /**
    * The static method that controls the access to the singleton instance.
    *
    * This implementation let you subclass the Singleton class while keeping
    * just one instance of each subclass around.
    */
   public static getInstance(): Helper {
       if (!Helper.instance) {
         Helper.instance = new Helper();
       }

       return Helper.instance;
   }

   /**
    * Finally, any singleton should define some business logic, which can be
    * executed on its instance.
    */
   public transformArrayToObject(collection: any[]) {
      const object: Record<string, { count: number; status: string }> = {};

      collection.forEach((item: any) => {
         object[item.status] = item.count;
      });

      return object;
   }

   /**
    * 
    * @param queryString 
    * @returns 
    */
   public parseQueryParams(queryString: string): Record<string, string> {
      const params = new URLSearchParams(queryString);
      const queryParams: Record<string, string> = {};
    
      params.forEach((value, key) => {
        if (value) queryParams[key] = value;
      });
    
      return queryParams;
   }

   /**
    * 
    * @param url 
    * @returns 
    */
   public groupParamsToArrays(url: string): Record<string, string[]> {
      const params = new URLSearchParams(url);
      const groupedParams: Record<string, string[]> = {};
    
      params.forEach((value, key) => {
        if (groupedParams[key]) {
          groupedParams[key].push(value);
        } else {
          groupedParams[key] = [value];
        }
      });
    
      return groupedParams;
    }

   /**
    * 
    * @param searchParams 
    * @returns 
    */
   public getCurrentFilters(searchParams: any) {
      const params = new URLSearchParams(searchParams)
      return this.parseQueryParams(params.toString());
   }

   /**
    * 
    * @param searchParamsStr 
    */
   public appendFilterParams(searchParams: any, keyParam: string, value: any) {
      if (value == undefined) {
         value = '';
      }

      const option = this.getCurrentFilters(searchParams);
      let queryParams: string = searchParams.toString()
      let paramValue = searchParams.get(keyParam)

      const queryParamsObj = this.groupParamsToArrays(queryParams);
      if (queryParamsObj && queryParamsObj[keyParam] && queryParamsObj[keyParam].length > 0) {
         paramValue = queryParamsObj[ keyParam ][ queryParamsObj[keyParam].length - 1 ];
         
         queryParams = Object.keys(queryParamsObj).map((key: string) => `${key}=${queryParamsObj[ key ][ queryParamsObj[key].length - 1 ]}`).join('&')
      }

      const foundAtPosition = queryParams.search(`${keyParam}=${paramValue}`)
      if (foundAtPosition >= 0) {
         queryParams = queryParams.replace(`${keyParam}=${paramValue}`, `${keyParam}=${value}`)
      } else {
         if (Object.keys(option).length > 0) {
            queryParams += `&${keyParam}=${value}`
         } else {
            queryParams = `${keyParam}=${value}`
         }
      }

      option[`${keyParam}`] = value;

      return {
         queryParams,
         option
      };
   }

   /**
    * 
    * @param riskCauses []
    * @param rawRiskCause any
    */
   public mapRiskCauses(riskCauses?: any[], rawRiskCause?: any) {
      return riskCauses?.map((riskCause: RiskCause, index: number) => {
         return {
           id: riskCause.status === 'NEW' ? Date.now() * Math.floor(Math.random() * 1000) + 1 : riskCause.id,
           category: rawRiskCause[`riskCauseCategory[${index}]`],
           cause: rawRiskCause[`riskCause[${index}]`],
           status: riskCause.status
         };
       })
       .filter((riskCause: RiskCause) => riskCause.category || riskCause.cause);
   }

   /**
    * 
    * @param impactInherentRisks []
    * @param rawImpactInherentRisk any
    * @returns 
    */
   public mapImpactInherentRisks(impactInherentRisks?: any[], rawImpactInherentRisk?: any) {
      return impactInherentRisks?.map((impactInherentRisk: any, index: number) => {
         return {
            id: impactInherentRisk.status === 'NEW' ? Date.now() * Math.floor(Math.random() * 1000) + 1 : impactInherentRisk.id,
            inherentImpactCategory: rawImpactInherentRisk[`impactCategory[${index}]`],
            inherentImpactRating: rawImpactInherentRisk[`impactRating[${index}]`],
            inherentImpactJustification: rawImpactInherentRisk[`impactJustification[${index}]`] ?? '',
            inherentExistingCtrlCategory: rawImpactInherentRisk[`impactExistingRiskTreatmentCategory[${index}]`],
            impactExistingRiskTreatment: rawImpactInherentRisk[`impactExistingRiskTreatment[${index}]`],
            impactRiskTreatmentFocalPoint: rawImpactInherentRisk[`impactRiskTreatmentFocalPoint[${index}]`],
            status: impactInherentRisk.status
         };
       });
   }

   /**
    * 
    * @param riskTreatmentImpacts []
    * @param rawRiskTreatmentImpact any
    * @returns 
    */
   public mapRiskTreatmentImpacts(riskTreatmentImpacts?: any[], rawRiskTreatmentImpact?: any) {
      return riskTreatmentImpacts?.map((riskTreatmentImpact: any, index: number) => {
         return {
            id: riskTreatmentImpact.status === 'NEW' ? Date.now() * Math.floor(Math.random() * 1000) + 1 : riskTreatmentImpact.id,
            impactAddCtrlCategory: rawRiskTreatmentImpact[`impactAddCtrlCategory[${index}]`],
            impactAddCtrlDescription: rawRiskTreatmentImpact[`impactAddCtrlDescription[${index}]`],
            impactRemarks: rawRiskTreatmentImpact[`impactRemarks[${index}]`],
            impactPIC: rawRiskTreatmentImpact[`impactPIC[${index}]`],
            impactDueDate: moment(rawRiskTreatmentImpact[`impactDueDate[${index}]`]).format('YYYY-MM-DD'),
            impactCost: rawRiskTreatmentImpact[`impactCost[${index}]`],
            impactStatus: rawRiskTreatmentImpact[`impactStatus[${index}]`],
            status: riskTreatmentImpact.status
         };
       });
   }

   /**
    * 
    * @param likelihoodInherentRisks array
    * @param rawLikelihoodInherentRisk any
    * @returns 
    */
   public mapRiskTreatmentLikelihoods(likelihoodInherentRisks?: any[], rawLikelihoodInherentRisk?: any) {
      const results = likelihoodInherentRisks?.map((likelihoodInherentRisk: any, index: number) => {
         return {
            id: likelihoodInherentRisk.status === 'NEW' ? Date.now() * Math.floor(Math.random() * 1000) + 1 : likelihoodInherentRisk.id,
            likelihoodAddCtrlCategory: rawLikelihoodInherentRisk[`likelihoodAddCtrlCategory[${index}]`],
            likelihoodAddCtrlDescription: rawLikelihoodInherentRisk[`likelihoodAddCtrlDescription[${index}]`],
            likelihoodRemarks: rawLikelihoodInherentRisk[`likelihoodRemarks[${index}]`],
            likelihoodPIC: rawLikelihoodInherentRisk[`likelihoodPIC[${index}]`],
            likelihoodDueDate: moment(rawLikelihoodInherentRisk[`likelihoodDueDate[${index}]`]).format('YYYY-MM-DD'),
            likelihoodCost: rawLikelihoodInherentRisk[`likelihoodCost[${index}]`],
            likelihoodStatus: rawLikelihoodInherentRisk[`LikelihoodStatus[${index}]`],
            status: likelihoodInherentRisk.status
         };
      });

      return results?.filter((value: any) => value.likelihoodAddCtrlCategory !== null);
   }

   /**
    * 
    * @param scope 
    * @returns 
    */
   hasPermission(scope: Permission) {
      const profile: any = getCookie('profile');
      let scopes: string[] = [];
      if (profile) {
         scopes = JSON.parse(profile)?.scopes;
      }
      
      const hasPermission = scopes.findIndex((value: string) => value === scope) >= 0;

      if (!hasPermission) {
         Swal.fire({
            icon: "warning",
            title: "Insufficient Permissions",
            text: "You do not have the necessary permissions to perform this operation.",
            showConfirmButton: false,
            timer: 3000
         });
      }

      return hasPermission;
   }

   /**
    * 
    * @param scope 
    * @returns 
    */
   hasNoPermission(scope: string) {
      const profile: any = getCookie('profile');
      let scopes: string[] = [];
      if (profile) {
         scopes = JSON.parse(profile)?.scopes;
      }

      const noPermission = scopes.findIndex((value: string) => value === scope) < 0;

      if (noPermission) {
         Swal.fire({
            icon: "warning",
            title: "Insufficient Permissions",
            text: "You do not have the necessary permissions to perform this operation.",
            showConfirmButton: false,
            timer: 5000
         });

         return;
      }

      return noPermission;
   }

   /**
    * 
    * @param scope 
    * @returns 
    */
   isRetricAccess(scope: Permission) {
      const profile: any = getCookie('profile');
      let scopes: string[] = [];
      if (profile) {
         scopes = JSON.parse(profile)?.scopes;
      } else {
         return false;
      }

      return scopes.findIndex((value: string) => value === scope) < 0;
   }
}