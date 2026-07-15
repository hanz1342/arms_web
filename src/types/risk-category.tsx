import { BaseFilter } from "./base-filter";

export interface RiskCategoryInterface {
    RcatID: number | string;
    Level1: string;
    Level2: string;
    Level3: string;
    Enabled: string;
};

export interface FormDataInterface {
    Level1: string;
    Level2: string;
    Level3: string;
    Enabled: string;
};

export interface RiskCategoryFilter extends BaseFilter {}
