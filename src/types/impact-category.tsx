import { BaseFilter } from "./base-filter";

export interface ImpactCategoryInterface {
    id?: number;
    name: string;
    status: number;
};

export interface ImpactCategoryFilter extends BaseFilter {}


