import { Descriptions } from "@/components";

interface InherentLikelihoodDetailsProps {
   data: any
}

export function InherentLikelihoodDetails(props: InherentLikelihoodDetailsProps) {
   const { data } = props;

   const items = [
      {
        key: '1',
        label: 'Category',
        children: data?.inherentLikelihoodCategory,
      },
      {
        key: '2',
        label: 'Rating',
        children: data?.inherentLikelihoodRating,
      },
      {
        key: '3',
        label: 'Justification',
        children: data?.inherentLikelihoodJustification,
      },
      {
        key: '4',
        label: 'Existing Risk Treatment Category',
        children: data?.inherentLikelihoodExisitingCtrlCat,
      },
      {
        key: '5',
        label: 'Existing Risk Treatment',
        children: data?.inherentLikelihoodExisitingCtrlInfo,
      },
      {
        key: '6',
        label: 'Risk Treatment Focal Point',
        children: data?.inherentLikelihoodPIC,
      },
   ];

   return <>
      <div className="header-risk-score">
      <span className="title">Inherent Likelihood Details</span>
      </div>
      <div className="likelihood-details">
         <Descriptions layout="vertical" column={6} items={items} />
      </div>
   </>
}