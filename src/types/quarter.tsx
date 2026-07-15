import { BaseFilter } from "./base-filter";

export interface QuarterInterface {
    id?: number;
    name: string;
    months?: string;
};

export interface QuarterFilter extends BaseFilter {}


