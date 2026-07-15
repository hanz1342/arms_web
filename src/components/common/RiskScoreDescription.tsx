interface RiskScoreDescriptionProps {
   title: string;
}
export function RiskScoreDescription(props: RiskScoreDescriptionProps) {
   const colors: any = {
      Significant: '#FFBF00',
      Minor: '#00A36C',
      Medium: '#f0e130',
      ['Very Significant']: '#C41E3A',
   };

   return <span style={{ color: colors[props.title] ??  '#000'}}>{props.title}</span>
}