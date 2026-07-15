import { DashboardFilter } from '@/types/dashboard';
import { RiskCategoryFilter } from '@/types/risk-category';
import axios, { AxiosRequestConfig } from 'axios'

const api  = (option: AxiosRequestConfig) => axios({
   baseURL: `${process.env.NEXT_PUBLIC_BASE_API_URL}/api`,
   ...option
})

const responseTransformer = (response: any) => {
   return new Promise((resolve, reject) => {
      response
         .then((response: any) => resolve(response.data))
         .catch((error: any) => reject(error));
   })
}

const bindRiskQuery = (option?: DashboardFilter | RiskCategoryFilter | any) => {
   let queryParams = [];

   if (option?.search) queryParams.push(`search=${option.search}`)
   if (option?.fiscalYear) queryParams.push(`fiscalYear=${option.fiscalYear}`);
   if (option?.quarter) queryParams.push(`quarter=${option.quarter}`);
   if (option?.department) queryParams.push(`department=${option.department}`);
   if (option?.category) queryParams.push(`category=${option.category}`);
   if (option?.directorate) queryParams.push(`directorate=${option.directorate}`);
   if (option?.riskCategoryL1) queryParams.push(`riskCategoryL1=${option.riskCategoryL1}`);
   if (option?.riskCategoryL2) queryParams.push(`riskCategoryL2=${option.riskCategoryL2}`);
   if (option?.riskCategoryL3) queryParams.push(`riskCategoryL3=${option.riskCategoryL3}`);
   if (option?.division) queryParams.push(`division=${option.division}`);
   if (option?.inherentRiskScoreDes) queryParams.push(`inherentRiskScoreDes=${option.inherentRiskScoreDes}`);
   if (option?.residualRiskScoreDes) queryParams.push(`residualRiskScoreDes=${option.residualRiskScoreDes}`);
   if (option?.aggFlag) queryParams.push(`aggFlag=${option.aggFlag}`);
   if (option?.riskScoreType) queryParams.push(`riskScoreType=${option.riskScoreType}`);
   if (option?.iRiskScore) queryParams.push(`iRiskScore=${option.iRiskScore}`);
   if (option?.rRiskScore) queryParams.push(`rRiskScore=${option.rRiskScore}`);
   if (option?.riskId) queryParams.push(`riskId=${option.riskId}`);
   if (option?.riskEvent) queryParams.push(`riskEvent=${option.riskEvent}`);
   if (option && option.status >= 0) queryParams.push(`status=${option.status}`);
   if (option?.impactStatus) queryParams.push(`impactStatus=${option.impactStatus}`);
   if (option?.roleId) queryParams.push(`roleId=${option.roleId}`);
   if (option?.riskStatus) queryParams.push(`riskStatus=${option.riskStatus}`);
   if (option?.riskStatuses && option?.riskStatuses.length > 0) queryParams.push(`riskStatuses=${option.riskStatuses}`);
   if (option?.sortColumn) queryParams.push(`sortColumn=${option.sortColumn}`);
   if (option?.sortType) queryParams.push(`sortType=${option.sortType}`);
   if (option?.page) queryParams.push(`page=${option.page}`);
   if (option?.pageSize) queryParams.push(`page_size=${option.pageSize}`);

   queryParams.push(`rmType=${option?.rmType ? option.rmType : ''}`);
   
   return queryParams.map((param: string, index: number) => index === 0 ? param : `&${param}`).join('');
}

export {
   api,
   responseTransformer,
   bindRiskQuery
} 