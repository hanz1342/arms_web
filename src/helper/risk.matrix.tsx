/**
 * The Singleton class defines the `getInstance` method that lets clients access
 * the unique singleton instance.
 */
export default class RiskMatrixHelper {
   private static instance: RiskMatrixHelper;

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
   public static getInstance(): RiskMatrixHelper {
      if (!RiskMatrixHelper.instance) {
         RiskMatrixHelper.instance = new RiskMatrixHelper();
      }

      return RiskMatrixHelper.instance;
   }

   /**
    * 
    * @param inherentLikelihoodRating 
    * @param ihr1 
    * @param ihr2 
    * @param ihr3 
    */
   public calculateInherentScore(inherentLikelihoodRating: number, maxInherent: number) {
      const lowColor = '#69aa60';
      const mediumColor = '#efce59';
      const significantColor = '#f3993f';
      const verySignificantColor = '#e46769';
      const noScoreColor = '#eaecf4';

      let inherentRiskScoredesc = '';
      let inherentRiskScoreColor = '';
      let inherentRiskScore = maxInherent * inherentLikelihoodRating;
      
      // Low
      if ((maxInherent == 1 || maxInherent == 2) && inherentLikelihoodRating >= 1 && inherentLikelihoodRating <= 4) {
         inherentRiskScoredesc = 'Minor';
         inherentRiskScoreColor = lowColor;
      }

      // Medium
      else if (maxInherent == 4 && inherentLikelihoodRating == 1) {
         inherentRiskScoredesc = 'Medium';
         inherentRiskScoreColor = mediumColor;
      } else if (maxInherent == 3 && inherentLikelihoodRating == 2) {
         inherentRiskScoredesc = 'Medium';
         inherentRiskScoreColor = mediumColor;
      } else if (maxInherent == 3 && inherentLikelihoodRating == 3) {
         inherentRiskScoredesc = 'Medium';
         inherentRiskScoreColor = mediumColor;
      } else if (maxInherent == 2 && inherentLikelihoodRating == 4) {
         inherentRiskScoredesc = 'Medium';
         inherentRiskScoreColor = mediumColor;
      } else if (maxInherent == 1 && inherentLikelihoodRating == 5) {
         inherentRiskScoredesc = 'Medium';
         inherentRiskScoreColor = mediumColor;
      }

      // Significant
      else if(maxInherent == 4 && inherentLikelihoodRating == 2) {
			inherentRiskScoredesc = 'Significant';
         inherentRiskScoreColor = significantColor;
		} else if(maxInherent == 4 && inherentLikelihoodRating == 3) {
			inherentRiskScoredesc = 'Significant';
         inherentRiskScoreColor = significantColor;
		} else if(maxInherent == 3 && inherentLikelihoodRating == 4){
			inherentRiskScoredesc = 'Significant';
         inherentRiskScoreColor = significantColor;
		} else if(maxInherent == 2 && inherentLikelihoodRating == 5){
         inherentRiskScoredesc = 'Significant';
         inherentRiskScoreColor = significantColor;
		} else if(maxInherent == 3 && inherentLikelihoodRating == 5){
			inherentRiskScoredesc = 'Significant';
         inherentRiskScoreColor = significantColor;
		}

      // Very Significant
      else if(maxInherent == 5 && inherentLikelihoodRating == 1){
			inherentRiskScoredesc = 'Very Significant';
         inherentRiskScoreColor = verySignificantColor;
		} else if(maxInherent == 5 && inherentLikelihoodRating == 2){
			inherentRiskScoredesc = 'Very Significant';
         inherentRiskScoreColor = verySignificantColor;
		} else if(maxInherent == 5 && inherentLikelihoodRating == 3){
			inherentRiskScoredesc = 'Very Significant';
         inherentRiskScoreColor = verySignificantColor;
		} else if(maxInherent == 4 && inherentLikelihoodRating == 4){
			inherentRiskScoredesc = 'Very Significant';
         inherentRiskScoreColor = verySignificantColor;
		} else if(maxInherent == 5 && inherentLikelihoodRating == 4){
			inherentRiskScoredesc = 'Very Significant';
         inherentRiskScoreColor = verySignificantColor;
		} else if(maxInherent == 4 && inherentLikelihoodRating == 5){
			inherentRiskScoredesc = 'Very Significant';
         inherentRiskScoreColor = verySignificantColor;
		} else if(maxInherent == 5 && inherentLikelihoodRating == 5){
			inherentRiskScoredesc = 'Very Significant';
         inherentRiskScoreColor = verySignificantColor;
		}

      // No Score
      else {
         inherentRiskScoredesc = '';
         inherentRiskScoreColor = noScoreColor;
      }
      console.log('ddddd:', {
         inherentRiskScore,
         inherentRiskScoredesc,
         inherentRiskScoreColor
      });
      return {
         inherentRiskScore,
         inherentRiskScoredesc,
         inherentRiskScoreColor
      };
   }

   /**
    * 
    * @param residualImpactRating 
    * @param residualLikelihoodRating 
    * @returns 
    */
   public calculateResidualScore(residualImpactRating: number, residualLikelihoodRating: number) {
      const lowColor = '#69aa60';
      const mediumColor = '#efce59';
      const significantColor = '#f3993f';
      const verySignificantColor = '#e46769';
      const noScoreColor = '#eaecf4';

      const residualRiskScore = residualImpactRating * residualLikelihoodRating;
      let residualRiskScoredesc = '';
      let residualRiskScoreColor = '';

      // LOW
      if (residualImpactRating == 1 && residualLikelihoodRating == 1) {
         residualRiskScoredesc = 'Minor';
         residualRiskScoreColor = lowColor;
      } else if (residualImpactRating == 2 && residualLikelihoodRating == 1) {
         residualRiskScoredesc = 'Minor';
         residualRiskScoreColor = lowColor;
      } else if (residualImpactRating == 3 && residualLikelihoodRating == 1) {
         residualRiskScoredesc = 'Minor';
         residualRiskScoreColor = lowColor;
      } else if (residualImpactRating == 1 && residualLikelihoodRating == 2) {
         residualRiskScoredesc = 'Minor';
         residualRiskScoreColor = lowColor;
      } else if (residualImpactRating == 2 && residualLikelihoodRating == 2) {
         residualRiskScoredesc = 'Minor';
         residualRiskScoreColor = lowColor;
      } else if (residualImpactRating == 1 && residualLikelihoodRating == 3) {
         residualRiskScoredesc = 'Minor';
         residualRiskScoreColor = lowColor;
      } else if (residualImpactRating == 2 && residualLikelihoodRating == 3) {
         residualRiskScoredesc = 'Minor';
         residualRiskScoreColor = lowColor;
      } else if (residualImpactRating == 1 && residualLikelihoodRating == 4) {
         residualRiskScoredesc = 'Minor';
         residualRiskScoreColor = lowColor;
      }

      // Medium

      else if (residualImpactRating == 4 && residualLikelihoodRating == 1) {
         residualRiskScoredesc = 'Medium';
         residualRiskScoreColor = mediumColor;
      } if (residualImpactRating == 3 && residualLikelihoodRating == 2) {
         residualRiskScoredesc = 'Medium';
         residualRiskScoreColor = mediumColor;
      } if (residualImpactRating == 3 && residualLikelihoodRating == 3) {
         residualRiskScoredesc = 'Medium';
         residualRiskScoreColor = mediumColor;
      } if (residualImpactRating == 2 && residualLikelihoodRating == 4) {
         residualRiskScoredesc = 'Medium';
         residualRiskScoreColor = mediumColor;
      } if (residualImpactRating == 1 && residualLikelihoodRating == 5) {
         residualRiskScoredesc = 'Medium';
         residualRiskScoreColor = mediumColor;
      }

      // Significant

      else if (residualImpactRating == 4 && residualLikelihoodRating == 2) {
         residualRiskScoredesc = 'Significant';
         residualRiskScoreColor = significantColor;
      } else if (residualImpactRating == 4 && residualLikelihoodRating == 3) {
         residualRiskScoredesc = 'Significant';
         residualRiskScoreColor = significantColor;
      } else if (residualImpactRating == 3 && residualLikelihoodRating == 4) {
         residualRiskScoredesc = 'Significant';
         residualRiskScoreColor = significantColor;
      } else if (residualImpactRating == 2 && residualLikelihoodRating == 5) {
         residualRiskScoredesc = 'Significant';
         residualRiskScoreColor = significantColor;
      } else if (residualImpactRating == 3 && residualLikelihoodRating == 5) {
         residualRiskScoredesc = 'Significant';
         residualRiskScoreColor = significantColor;
      }

      // Very Significant

      else if (residualImpactRating == 5 && residualLikelihoodRating == 1) {
         residualRiskScoredesc = 'Very Significant';
         residualRiskScoreColor = verySignificantColor;
      } if (residualImpactRating == 5 && residualLikelihoodRating == 2) {
         residualRiskScoredesc = 'Very Significant';
         residualRiskScoreColor = verySignificantColor;
      } if (residualImpactRating == 5 && residualLikelihoodRating == 3) {
         residualRiskScoredesc = 'Very Significant';
         residualRiskScoreColor = verySignificantColor;
      } if (residualImpactRating == 4 && residualLikelihoodRating == 4) {
         residualRiskScoredesc = 'Very Significant';
         residualRiskScoreColor = verySignificantColor;
      } if (residualImpactRating == 5 && residualLikelihoodRating == 4) {
         residualRiskScoredesc = 'Very Significant';
         residualRiskScoreColor = verySignificantColor;
      } if (residualImpactRating == 4 && residualLikelihoodRating == 5) {
         residualRiskScoredesc = 'Very Significant';
         residualRiskScoreColor = verySignificantColor;
      } if (residualImpactRating == 5 && residualLikelihoodRating == 5) {
         residualRiskScoredesc = 'Very Significant';
         residualRiskScoreColor = verySignificantColor;
      }

      // No Score
      else if (!residualRiskScore) {
         residualRiskScoredesc = '';
         residualRiskScoreColor = noScoreColor;
      }

      return {
         residualRiskScore,
         residualRiskScoredesc,
         residualRiskScoreColor
      };
   }
}