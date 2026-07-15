'use client'
import {
  Descriptions,
  Button,
  Spin,
  Table,
  RiskScoreDescription,
  Modal
} from "@/components";
import './style.css';
import React from "react";
import Swal from "sweetalert2";
import { getRiskById, markRiskActiveById, markRiskCancelledById } from "@/services";
import { InherentLikelihoodDetails } from "./lnherent_likelihood_details";
import { AdditionalRiskTreatment } from "./additional_risk_treatment";
import { ArrowLeftOutlined } from "@/components/icons";
import { useSearchParams } from "@/router";
import { RiskStatus } from "@/enums";
import Link from "next/link";
import Helper from "@/helper";

export default function Page({ params }: { params: { riskId: string } }) {
  const [open, setOpen] = React.useState(false);
  const [openActive, setOpenActive] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [data, setData] = React.useState<any>(null);
  const searchParams = useSearchParams();

  React.useEffect(() => {
    setLoading(true)
    getRiskById(params.riskId)
    .then((response: any) => {
      if (response) {
        setData(response)
      }
    })
    .finally(() => setLoading(false))
  }, []);
  

  const items = [
    {
      key: '1',
      label: 'Period',
      children: data?.fiscalYear,
    },
    {
      key: '2',
      label: 'Department',
      children: data?.department,
    },
    {
      key: '3',
      label: 'Directorate',
      children: data?.directorate
    },
    {
      key: '4',
      label: 'Division',
      children: data?.division,
    },
    {
      key: '5',
      label: 'Objectives',
      children: data?.objectives,
    },
    {
      key: '6',
      label: 'Risk Category Level 1',
      children: data?.riskCategoryL1,
    },
    {
      key: '7',
      label: 'Risk Category Level 2',
      children: data?.riskCategoryL2,
    },
    {
      key: '8',
      label: 'Risk Category Level 3',
      children: data?.riskCategoryL3,
    },
    {
      key: '9',
      label: 'Risk Event',
      children: data?.riskEvent,
    },
  ];

  const itemsRiskScore = [
    {
      key: '1',
      label: 'Impact Rating',
      children: data?.inherentImpactRating,
    },
    {
      key: '2',
      label: 'Likelihood Rating',
      children: data?.inherentLikelihoodRating,
    },
    {
      key: '3',
      label: 'Risk Score',
      children: data?.inherentRiskScore,
    },
    {
      key: '4',
      label: 'Risk Score Description',
      children: <RiskScoreDescription title={data?.inherentRiskScoreDescription} />,
    },
  ];

  const columnsImpactDetail: any = [
    {
      title: 'Category',
      dataIndex: 'inherentImpactCategory',
      key: 'inherentImpactCategory',
    },
    {
      title: 'Rating',
      dataIndex: 'inherentImpactRating',
      key: 'inherentImpactRating',
    },
    {
      title: 'Justification',
      dataIndex: 'inherentImpactJustification',
      key: 'inherentImpactJustification',
      width: '15%',
    },
    {
      title: 'Existing Risk Treatment Category',
      width: 200,
      align: 'center',
      dataIndex: 'inherentExistingCtrlCategory',
      key: 'inherentExistingCtrlCategory',
    },
    {
      title: 'Existing Risk Treatment',
      dataIndex: 'inherentExistingCtrlInfo',
      key: 'inherentExistingCtrlInfo',
      width: '15%',
    },
    {
      title: 'Risk Treatment Focal Point',
      dataIndex: 'inherentPersonInCharge',
      key: 'inherentPersonInCharge',
      width: '15%',
    },
  ];

  const rightActionButton = (riskStatus?: string) => {
    if (riskStatus === RiskStatus.ACTIVE) {
      return <Button danger loading={false} disabled={false} type="primary" onClick={() => setOpen(true)} style={{ marginLeft: 15 }}>
        Mark as Cancelled
      </Button>
    } else if (riskStatus === RiskStatus.CANCELLED) {
      return <Button disabled={submitting} type="primary" onClick={() => setOpenActive(true)} style={{ marginLeft: 15 }}>
        Mark as Active
      </Button>
    }
  }

  const onMarkRiskAsCancelled = () => {
    if (Helper.getInstance().hasPermission('RISK.CANCEL.RISK')) {
      setSubmitting(true);
      markRiskCancelledById(data.riskId)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Your work has been updated",
          showConfirmButton: false,
          timer: 1500
        });
      })
      .finally(() => {
        setSubmitting(false);
      });
    }
  };

  const onMarkRiskAsActive = () => {
    if (Helper.getInstance().hasPermission('CANCELLED.RISK.UPDATE')) {
      setSubmitting(true);
      markRiskActiveById(data.riskId)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Your work has been updated",
          showConfirmButton: false,
          timer: 1500
        });
      })
      .finally(() => {
        setSubmitting(false);
      });
    }
  };

  const backUrl = searchParams.get('back');

  return (<Spin spinning={loading}>
      <Modal
         title="Are you sure?"
         open={openActive}
         onOk={onMarkRiskAsActive}
         onCancel={() => setOpenActive(false)}
         okText="Yes, active it!"
         okButtonProps={{ danger: true, loading: submitting, disabled: submitting }}
         cancelText="Cancel"
      >
         <p>You will be able to revert this!</p>
      </Modal>

      <Modal
         title="Are you sure?"
         open={open}
         onOk={onMarkRiskAsCancelled}
         onCancel={() => setOpen(false)}
         okText="Yes, cancel it!"
         okButtonProps={{ danger: true, loading: submitting, disabled: submitting }}
         cancelText="Cancel"
      >
         <p>You will be able to revert this!</p>
      </Modal>
      <section className="risk-detail">
        <div className="header" style={{display: 'flex', justifyContent: 'space-between'}}>
          <div>
            <Link href={backUrl ? `/${backUrl}`  : '/'}>
              <Button icon={<ArrowLeftOutlined />}>
                Back
              </Button>
            </Link>

            <span className="title" style={{ marginLeft: 15 }}>{params.riskId}</span>
          </div>
          {backUrl === 'cancelled_risks' && rightActionButton(data?.riskStatus)}
        </div>
        <div className="description-detail">
          <Descriptions title="Risk Details" layout="vertical" items={items} column={4} />
          <div className="risk-couse-detail">
            <div className="header">
              <h3 className="title">Risk Cause Details</h3>
            </div>
            <Table
              dataSource={data?.riskCauses ?? []}
              rowKey={'RC_ID'}
              columns={[
                {
                  title: 'Category',
                  dataIndex: 'category',
                  key: 'category',
                  width: '50%'
                },
                {
                  title: 'Risk Cause',
                  dataIndex: 'cause',
                  key: 'cause',
                  width: '50%'
                }
              ]}
              className="striped-table"
              pagination={false}
              scroll={{
                x: 300,
              }}
            />
          </div>
        </div>
      </section>
      <section className="inherent-risk-assessment-treatment">
        <div className="header">
          <h3 className="title">Inherent Risk Assessment & Treatment</h3>
        </div>
        <div className="risk-score">
          <div className="header-risk-score">
            <span className="title">Risk Score</span>
          </div>
          <div className="risk-score-content">
            <Descriptions layout="vertical" column={4} items={itemsRiskScore} />
          </div>

          <div className="header-risk-score">
            <span className="title">Inherent Impact Details</span>
          </div>

          <Table
            dataSource={data?.impactInherentRisks ?? []}
            columns={columnsImpactDetail}
            rowKey="RI_ID"
            className="striped-table"
            pagination={false}
            scroll={{
              x: 300,
            }}
          />

          <InherentLikelihoodDetails data={data} />

        </div>
      </section>

      <AdditionalRiskTreatment data={data} />

      <section className="residual-risk-assessment">
        <div className="header">
          <h3 className="title">Residual Risk Assessment</h3>
        </div>

        <div className="residual-risk-assessment-content">
          <div className="header-risk-score">
            <span className="title">Risk Score</span>
          </div>
          <div className="likelihood-details">
            <Descriptions
              layout="vertical"
              column={4}
              items={[
                {
                  key: '1',
                  label: 'Impact Rating',
                  children: data?.residualImpactRating,
                },
                {
                  key: '2',
                  label: 'Liklihood Rating',
                  children: data?.residualLikelihoodRating,
                },
                {
                  key: '3',
                  label: 'Risk Score',
                  children: data?.residualRiskScore,
                },
                {
                  key: '4',
                  label: 'Risk Score Description',
                  children: <RiskScoreDescription title={data?.residualRiskScoreDescription} />,
                }]}
            />
          </div>
        </div>
      </section>
  </Spin>)
}
