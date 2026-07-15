import { BaseFilter } from "./base-filter";

export interface RoleInterface {
    id?: number;
    name: string;
    sort: number;
    status: string;
};

export interface RoleFilter extends BaseFilter {}


