import { BaseFilter } from "./base-filter";

export interface DepartmentInterface {
    id?: number;
    name: string;
    status: number;
};

export interface DepartmentFilter extends BaseFilter {}


