'use client'
import React from "react";
import moment from 'moment';
import {
  Form,
  Table,
  Row,
  Col,
  PageTitle,
  Button
} from "@/components";
import type { ColumnsType } from 'antd/es/table';
import { useRouter, useSearchParams } from "@/router";
import { PaginateResponse } from "@/responses";
import { getRisksAggDirectorateByOption } from "@/services";
import { ArrowLeftOutlined } from "@/components/icons";

interface DataType {
  key: string;
  risk_category_level_1: string;
  risk_category_level_2: string;
  risk_category_level_3: string;
  impact: string;
  likelihood: string;
  score: string;
  top_risk: string;
  remarks: string;
};

export default function Page({ title } : { title: string }) {
  const [loading, setLoading] = React.useState(false)
  const [risks, setRisks] = React.useState<PaginateResponse>(new PaginateResponse())
  const router = useRouter()
  const [form] = Form.useForm()
  const searchParams = useSearchParams()

  React.useEffect(() => {
    const riskCategoryL1 = searchParams.get('lv1') || '';
    const riskCategoryL2 = searchParams.get('lv2') || '';
    const riskCategoryL3 = searchParams.get('lv3') || '';
    const fiscalYear = searchParams.get('fiscalYear') || '';
    const directorate = searchParams.get('directorate') || '';
    const quarter = searchParams.get('quarter') || '';
    const riskStatus = searchParams.get('riskStatus') || '';
    const option = {
      riskCategoryL1,
      riskCategoryL2,
      riskCategoryL3,
      fiscalYear,
      directorate,
      quarter,
      riskStatus
    };
    setLoading(true)
    getRisksAggDirectorateByOption(option)
    .then((response: any) => { console.log('Response:', response);
      if (response) {
        setRisks(response)
      }
    })
    .finally(() => {
      setLoading(false)
    })
  }, []);

  const columns: ColumnsType<DataType> = [
    {
      title: 'Risk ID',
      dataIndex: 'Risk_ID',
      key: 'Risk_ID',
      render: (riskId: string) => <div>{riskId}</div>
    },
    {
      title: 'Division',
      dataIndex: 'Division',
      key: 'Division'
    },
    {
      title: 'Risk Event Description',
      dataIndex: 'RiskEvent',
      key: 'RiskEvent'
    },
    {
      title: 'Risk Cause',
      dataIndex: 'risk_causes',
      key: 'risk_causes',
      render: (riskCauses: any[]) => {
        return <ul style={{ marginBlockStart: 0, paddingInlineStart: 0 }}>
          {riskCauses.map((riskCause: any, key: number) => <li key={key}>{riskCause.RiskCause}</li>)}
        </ul>
      }
    },
    {
      title: 'Inherent Risk',
      dataIndex: 'inherent_risk',
      key: 'inherent_risk',
      children:[
        {
          title: 'Impact',
          dataIndex: 'InherentImpactRating',
          key: 'InherentImpactRating',
        },
        {
          title: 'Likelihood',
          dataIndex: 'InherentLikelihoodRating',
          key: 'InherentLikelihoodRating',
        },
        {
          title: 'Score',
          dataIndex: 'InherentRiskScore',
          key: 'InherentRiskScore',
        }
      ]
    },
    {
      title: 'Additional Risk Treatment',
      dataIndex: 'residual_risk',
      key: 'residual_risk',
      children:[
        {
          title: 'Impact',
          dataIndex: 'risk_add_treatments',
          key: 'risk_add_treatments',
          render: (riskAddTreatments: any[]) => {
            return riskAddTreatments.map((riskAddTreatment: any, key: number) => <ul key={key} style={{ marginBottom: 25, marginBlockStart: 0, paddingInlineStart: 0 }}>
              <li>{riskAddTreatment.ImpactAddCtrlDescription}</li>
              <li>{riskAddTreatment.ImpactPIC}</li>
              <li>{moment(riskAddTreatment.ImpactDueDate).format('DD/MM/YYYY')}</li>
            </ul>
            );
          }
        },
        {
          title: 'Likelihood',
          dataIndex: 'risk_treatment_likelihoods',
          key: 'risk_treatment_likelihoods',
          render: (riskTreatmentLikelihoods: any[]) => {
            return riskTreatmentLikelihoods.map((riskTreatmentLikelihood: any, key: number) => <ul key={key} style={{ marginBottom: 25, marginBlockStart: 0, paddingInlineStart: 0 }}>
              <li>{riskTreatmentLikelihood.LikelihoodAddCtrlDescription}</li>
              <li>{riskTreatmentLikelihood.LikelihoodPIC}</li>
              <li>{moment(riskTreatmentLikelihood.LikelihoodDueDate).format('DD/MM/YYYY')}</li>
            </ul>
            );
          }
        }
      ]
    },
    {
      title: 'Residual Risk(Target)',
      dataIndex: 'residual_risk',
      key: 'residual_risk',
      children:[
        {
          title: 'Impact',
          dataIndex: 'ResidualImpactRating',
          key: 'ResidualImpactRating',
        },
        {
          title: 'Likelihood',
          dataIndex: 'ResidualLikelihoodRating',
          key: 'ResidualLikelihoodRating',
        },
        {
          title: 'Score',
          dataIndex: 'ResidualRiskScore',
          key: 'ResidualRiskScore',
        }
      ]
    }
  ];
  
  return(<Row gutter={[16, 16]}>
    <Col sm={24} md={20} xl={20} style={{ display: 'flex', alignItems: 'center' }}>
      <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>
        Back
      </Button>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <PageTitle title='Risk Aggregation Department (Update Lv3 chosen)' style={{ marginLeft: 15 }} />
      </div>
    </Col>
    <Col xl={4} style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Button type="primary" onClick={() => router.push('/risks/create?back=ra_directorates_show')} style={{ marginLeft: 15 }}>
        Add New Risk
      </Button>
    </Col>
    <Col sm={24} md={24} xl={24}>
        <h3>{title}</h3>
    </Col>

    <Col sm={24} md={12} xl={24}>
      <Form form={form} name="basic">
        <Table
          loading={loading}
          columns={columns}
          bordered
          dataSource={risks?.data ?? []}
          pagination={false}
          rowKey={'Risk_IDs'}
          className="striped-table"
          id="risk_agg_directorate"
        />
      </Form>
    </Col>
  </Row>)
}
