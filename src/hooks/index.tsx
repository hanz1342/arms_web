import { 
    getEmployeeSelectOptions
} from '@/services';
import { useState, useEffect } from 'react';

const useDebounce = (value: string, timeout: number = 500) => {
    const [state, setState] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => setState(value), timeout);

        return () => clearTimeout(handler);
    }, [value, timeout]);

    return state;
}

const useEmployeeOptions = () => {
    const [options, setOptions] = useState({
        departments: [],
        directorates: [],
        divisions: [],
        userTypes: []
    });
  
    useEffect(() => {
        getEmployeeSelectOptions()
        .then((response: any) => {
            if (response?.data) {
                const data = response.data;

                setOptions({
                    ...data,
                    userTypes: data.userTypes.map((role: any) => ({ ...role, disabled: role.status === 'deactive', title: role.status === 'deactive' ? 'Deactive' : '' }))
                });
            }
        })
        .finally(() => {})
    }, []);
  
    return { options };
};

const useRiskSelectOptions = () => {
    const [options, setOptions] = useState({
        period: { fiscalYear: (new Date()).getFullYear(), quarter: '' },
        departments: [],
        directorates: [],
        divisions: [],
        riskCauseCategories: [],
        categoriesLevel1: [],
        categoriesLevel2: [],
        categoriesLevel3: [],
        causeCategories: [],
        impactCategories: [],
        inherentImpactRatings: [],
        inherentLikelihoodRatings: [],
        existingRiskTreatmentCategories: [],
        riskTreatmentFocalPoints: [],
        likelihoodCategories: [],
        riskTreatmentStatuses: [],
        residualImpactRatings: [],
        residualLikelihoodRatings: []
    });
  
    return { options, setOptions };
};

export {
    useDebounce,
    useEmployeeOptions,
    useRiskSelectOptions
}