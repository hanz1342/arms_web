export class Risk {
   id?: string;
   fiscalYear?: number;
   quarter?: string;
   department?: string;
   directorate?: string;
   division?: string;
   objectives?: string;
   riskEvent?: string;
   inherentLikelihoodCategory?: string;
   inherentLikelihoodRating?: string;
   inherentLikelihoodJustification?: string;
   inherentLikelihoodExisitingCtrlCat?: string;
   inherentLikelihoodExisitingCtrlInfo?: string;
   inherentLikelihoodPIC?: string;
   residualImpactRating?: string;
   inherentRiskScoreDescription?: string;
   inherentRiskScore?: string;
   residualLikelihoodRating?: string;
   residualRiskScoreDescription?: string;
   residualRiskScore?: string;
   riskCauses?: RiskCause[];
   impactInherentRisks?: InherentRisk[];
   likelihoodInherentRisks?: InherentRisk[];
   impactRiskTreatments?: AdditionalRiskTreatment[];
   likelihoodRiskTreatments?: AdditionalRiskTreatment[];
   riskStatus?: string;

   constructor() {
      this.riskCauses = [new RiskCause()];
      this.impactInherentRisks = [new InherentRisk()];
      this.likelihoodInherentRisks = [new InherentRisk()];
      this.impactRiskTreatments = [new AdditionalRiskTreatment()];
      this.likelihoodRiskTreatments = [new AdditionalRiskTreatment()];
   }
}

export class RiskCause {
   id?: number;
   category?: string;
   cause?: string;
   status?: string;

   constructor() {
      this.id = (new Date()).getTime();
      this.category = '';
      this.cause = '';
      this.status = 'NEW';
   }
}

export class InherentRisk {
   id?: number;
   rating?: string;
   justification?: string;
   category?: string;
   existingRiskTreatment?: string;
   focalPoint?: string;
   status?: string;
   constructor() {
      this.id = (new Date()).getTime();
      this.status = 'NEW';
   }
}

export class AdditionalRiskTreatment {
   id?: number;
   category?: string;
   information?: string;
   remark?: string;
   focalPoint?: string;
   dueDate?: string;
   cost?: number;
   status?: string;
   constructor() {
      this.id = (new Date()).getTime();
      this.status = 'NEW';
   }
}