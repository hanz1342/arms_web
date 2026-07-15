import { BaseFilter } from "./base-filter";

export interface EmployeeFilter extends BaseFilter {
   department?: string;
   directorate?: string;
   division?: string;
   status?: string;
   roleId?: string;
}