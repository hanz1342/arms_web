import { Table } from "@/components";
import moment from "moment";

interface AdditionalRiskTreatmentProps {
   data: any
}

export function AdditionalRiskTreatment(props: AdditionalRiskTreatmentProps) {
   const { data } = props;

  const columnsImpactAdditionalControls = [
    {
      title: 'Additional Controlls',
      dataIndex: 'impactAddCtrlCategory',
      key: 'impactAddCtrlCategory',
    },
    {
      title: 'Details',
      dataIndex: 'impactAddCtrlDescription',
      key: 'impactAddCtrlDescription',
      width: '15%',
    },
    {
      title: 'Risk Treatment Focal Point',
      dataIndex: 'impactPIC',
      key: 'impactPIC',
      width: '15%',
    },
    {
      title: 'Due Date',
      dataIndex: 'impactDueDate',
      key: 'impactDueDate',
      render: (impactDueDate: string) => moment(impactDueDate).format('DD/MM/YYYY')
    },
    {
      title: 'Cost',
      dataIndex: 'impactCost',
      key: 'impactCost',
      render: (impactCost: number) => impactCost ?? '0.00'
    },
    {
      title: 'Status',
      dataIndex: 'impactStatus',
      key: 'impactStatus',
    },
    {
      title: 'Remark',
      dataIndex: 'impactRemarks',
      key: 'impactRemarks',
    },
  ];

  const columnsImpactLikelihoodAdditional = [
    {
      title: 'Additional Controlls',
      dataIndex: 'likelihoodAddCtrlCategory',
      key: 'likelihoodAddCtrlCategory',
    },
    {
      title: 'Details',
      dataIndex: 'likelihoodAddCtrlDescription',
      key: 'likelihoodAddCtrlDescription',
      width: '15%',
    },
    {
      title: 'Risk Treatment Focal Point',
      dataIndex: 'likelihoodPIC',
      key: 'likelihoodPIC',
      width: '15%',
    },
    {
      title: 'Due Date',
      dataIndex: 'likelihoodDueDate',
      key: 'likelihoodDueDate',
      render: (impactDueDate: string) => moment(impactDueDate).format('DD/MM/YYYY')
    },
    {
      title: 'Cost',
      dataIndex: 'likelihoodCost',
      key: 'likelihoodCost',
      render: (likelihoodCost: number) => likelihoodCost
    },
    {
      title: 'Status',
      dataIndex: 'likelihoodStatus',
      key: 'likelihoodStatus',
    },
    {
      title: 'Remark',
      dataIndex: 'likelihoodRemarks',
      key: 'likelihoodRemarks',
    },
  ];

   return <section className="additional-risk-treatment">
      <div className="additional-risk-treatment-content">
        <div className="header-risk-score">
          <span className="title">Impact Additional Controls</span>
        </div>
        <Table
          dataSource={data?.impactRiskTreatments ?? []}
          columns={columnsImpactAdditionalControls}
          rowKey="RAT_ID"
          className="striped-table"
          pagination={false}
        />

        <div className="header-risk-score">
          <span className="title">Likelihood Additional Controls</span>
        </div>
        <Table
          dataSource={data?.likelihoodRiskTreatments ?? []}
          columns={columnsImpactLikelihoodAdditional}
          rowKey="RAT_ID"
          className="striped-table"
          pagination={false}
        />
      </div>
    </section>
}