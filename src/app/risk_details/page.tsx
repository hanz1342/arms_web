'use client'
import React, {useState} from "react";
import Link from 'next/link';
import {
    Button, 
    Table,
    Select,
    Drawer,
    Row,
    Col,
    PageTitle,
    Form,
    DatePicker,
    Pagination,
    PaginationProps,
    NoPermission,
} from "@/components";
import { 
  CloseOutlined,
  DownloadOutlined,
  FileExcelOutlined,
  FilterOutlined,
  LinkOutlined
} from '@icons';
import { EyeOutlined } from '@/components/icons';
import type { ColumnsType } from 'antd/es/table';
import Helper from "@/helper";
import { useRouter, useSearchParams } from "@/router";
import { PaginateResponse } from "@/responses";
import { downloadExcel, getRisks, getSelectOptions } from "@/services";
import { RiskDetailFilter } from "@/types/risk-detail";
import orderByFields from "./export_fields";
import { Sort } from "@/types/sort";

interface DataType {
  key: string;
  action: string;
  risk_id: string;
  referenceId: string;
  fy: string;
  quarter: string;
  department: string;
  directorate: string;
  division: string;
  objective: string;
  risk_event: string;
  inherent_risk_score: string;
  inherent_risk_score_description: string;
  residual_risk_score: string;
  residual_risk_score_description: string;
}

export default function Page() {
  if (Helper.getInstance().isRetricAccess('RISK.DETAIL.VIEW')) {
    return <NoPermission />;
  }

  const [options, setOptions] = useState({
    cycles: [],
    departments: [],
    directorates: [],
    divisions: [],
    riskIds: [],
    riskEvents: [],
    aggregateFlages: [],
    inherentRiskScores: [],
    residualRiskScores: [],
  });

  const [sort, setSort] = React.useState<Sort>();
  const [visibleDrawer, setVisibleDrawer] = React.useState(false)
  const [visibleExcelDrawer, setVisibleExcelDrawer] = React.useState(false)
  const [downloading, setDownloading] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [risks, setRisks] = React.useState<PaginateResponse>(new PaginateResponse())
  const instance = Helper.getInstance()
  const router = useRouter()
  const [formDrawer] = Form.useForm()
  const [formExcelDrawer] = Form.useForm()
  const [formFilter] = Form.useForm()

  const columns: ColumnsType<DataType> = [
    {
      title: 'Action',
      dataIndex: 'riskId',
      key: 'riskId',
      render: (riskId: string) => {
        return <Link href={`/risk_detail/${riskId}?back=risk_details`}><Button type="primary" shape="circle" icon={<EyeOutlined />} /></Link>;
      },
    },
    {
      title: 'Risk ID',
      dataIndex: 'riskId',
      key: 'riskId',
      sorter: true,
      defaultSortOrder: 'ascend',
      render: (riskId: string, record: any) => {
        return <div>
          {riskId}
          {
            record.referenceId && 
            <Link href={`/risk_detail/${record.referenceId}?back=risk_details`}>
              <div style={{ display: 'flex', fontSize: 12, marginTop: 5 }}>
                <LinkOutlined style={{ marginRight: 10 }} /> {record.referenceId}
              </div>
            </Link>
          }
        </div>;
      }
    },
    {
      title: 'FY',
      dataIndex: 'fiscalYear',
      key: 'fiscalYear',
      sorter: true,
    },
    {
      title: 'Quarter',
      dataIndex: 'quarter',
      key: 'quarter',
      sorter: true,
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      sorter: true,
    },
    {
      title: 'Diractorate',
      dataIndex: 'directorate',
      key: 'directorate',
      sorter: true,
    },
    {
      title: 'Division',
      dataIndex: 'division',
      key: 'division',
      sorter: true,
    },
    {
      title: 'Objectives',
      dataIndex: 'objectives',
      key: 'objectives',
      sorter: true,
    },
    {
      title: 'Risk Event',
      dataIndex: 'riskEvent',
      key: 'riskEvent',
      sorter: true,
    },
    {
      title: 'Inherent Risk',
      dataIndex: 'inherent',
      key: 'inherent',
      children: [
        {
          title: 'Score',
          dataIndex: 'inherentRiskScore',
          key: 'inherentRiskScore',
          sorter: true,
        },
        {
          title: 'Description',
          dataIndex: 'inherentRiskScoreDescription',
          key: 'inherentRiskScoreDescription',
          sorter: true,
        },
      ]
    },
    {
      title: 'Residual Risk',
      dataIndex: 'residualRiskScore',
      key: 'residualRiskScore',
      children: [
        {
          title: 'Score',
          dataIndex: 'residualRiskScore',
          key: 'residualRiskScore',
          sorter: true,
        },
        {
          title: 'Description',
          dataIndex: 'residualRiskScoreDescription',
          key: 'residualRiskScoreDescription',
          sorter: true,
        }
      ]
    }
  ];

  const searchParams = useSearchParams()

  React.useEffect(() => {
    fetchRisks();
    fetchSelectOptions();
  }, []);

  const fetchSelectOptions = () => {
    getSelectOptions()
    .then((response: any) => {
        if (response?.data) {
            setOptions(response.data);
        }
    })
    .finally(() => {

    })
};

  const fetchRisks = (option?: RiskDetailFilter) => {
    setLoading(true)
    getRisks(option)
    .then((response: any) => {
      if (response) {
        setRisks(response)
      }
    })
    .finally(() => setLoading(false))
  }

  const onShowDrawer = () => {
    setVisibleDrawer(true);
  }

  const onHideDrawer = () => {
      setVisibleDrawer(false);
  }

  const onResetFilter = () => {
    router.push('?')
    formFilter.resetFields()
    fetchRisks()
  }

  const onFinish = (values: any) => {
    const fiscalYear = values.fiscalYear?.format('YYYY') ?? '';
    const quarter = values.quarter ?? '';
    const directorate = values.directorate ?? '';
    const department = values.department ?? '';
    const division = values.division ?? '';
    const riskId = values.riskId ?? '';

    let queryParams = `fiscal_year=${fiscalYear}`
    queryParams += `&quarter=${quarter}`
    queryParams += `&directorate=${directorate}`
    queryParams += `&department=${department}`
    queryParams += `&riskId=${riskId}`

    router.push(`?${queryParams}`)
    onHideDrawer()

    const option = {
        fiscalYear,
        quarter,
        directorate,
        department,
        division,
        riskId
    };

    fetchRisks(option);
  };

  const onChangeDivision = (division: string) => {
    const { queryParams, option } = instance.appendFilterParams(searchParams, 'division', division);

    router.push(`?${queryParams}`);

    fetchRisks(option);
  };

  const onChangeInherentRiskScore = (inherentRiskScoreDes: string) => {
    const { queryParams, option } = instance.appendFilterParams(searchParams, 'inherentRiskScoreDes', inherentRiskScoreDes);

    router.push(`?${queryParams}`);

    fetchRisks(option);
  };

  const onChangeResidualRiskScore = (residualRiskScoreDes: string) => {
    const { queryParams, option } = instance.appendFilterParams(searchParams, 'residualRiskScoreDes', residualRiskScoreDes);

    router.push(`?${queryParams}`);

    fetchRisks(option);
  };

  const onChangeAggFlag = (aggFlag: string) => {
    const { queryParams, option } = instance.appendFilterParams(searchParams, 'aggFlag', aggFlag);

    router.push(`?${queryParams}`);

    fetchRisks(option);
  };

  const onDownloadExcel = () => {
    setDownloading(true);
    const values = formExcelDrawer.getFieldsValue();
    const currentFilters = instance.getCurrentFilters(searchParams);
    downloadExcel({...values, ...currentFilters})
    .finally(() => {
      setDownloading(false);
    });
  }

  /**
     * On Pagination Change Page
     * @param page 
     * @param pageSize 
     */
  const onChangePageSize = (page: number, pageSize: number) => {
    const {option, queryParams} = Helper.getInstance().appendFilterParams(searchParams, 'page', page);

    if (sort?.sortColumn && sort.sortType) {
      option.sortColumn = sort.sortColumn;
      option.sortType = sort.sortType;
    }

    fetchRisks({ ...option, pageSize });
    router.push(`?${queryParams}`);
  }

  const currentFilters = Helper.getInstance().getCurrentFilters(searchParams);

  const showTotal: PaginationProps['showTotal'] = (total, range) => `${range[0]}-${range[1]} of ${total} items`;
  
  return(<Row gutter={[16, 16]}>
    <Col sm={24} md={4} xl={4}>
        <PageTitle title='Risk Details' />
    </Col>
    <Col sm={24} md={20} xl={20}>
        <Form form={formFilter} layout="inline" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Form.Item name='division'>
            <Select
              placeholder="Select division"
              onChange={onChangeDivision}
              options={options?.divisions ?? []}
              allowClear
              style={{ minWidth: 200 }}
            />
          </Form.Item>
          <Form.Item name='inherentRiskScore'>
            <Select
              placeholder="Select nherent risk score"
              onChange={onChangeInherentRiskScore}
              options={options?.inherentRiskScores ?? []}
              allowClear
            />
          </Form.Item>
          <Form.Item name='residualRiskScore'>
            <Select
              placeholder="Select residual risk rcore"
              onChange={onChangeResidualRiskScore}
              options={options?.residualRiskScores ?? []}
              allowClear
            />
          </Form.Item>
          <Form.Item name='aggregateFlage'>
            <Select
              placeholder="Select aggregation flag"
              onChange={onChangeAggFlag}
              options={options?.aggregateFlages ?? []}
              allowClear
            />
          </Form.Item>
          <Button icon={<FilterOutlined />} onClick={onShowDrawer}>
            More Filter
          </Button>

          <Button icon={<CloseOutlined />} style={{ marginLeft: 10 }} onClick={onResetFilter}>
            Reset Filter {Object.keys(currentFilters).length > 0 ? `(${Object.keys(currentFilters).length})` : ''}
          </Button>

          <Button icon={<DownloadOutlined />} style={{ marginLeft: 10 }} onClick={() => setVisibleExcelDrawer(true)}>
            Download Excel
          </Button>
        </Form>
    </Col>
    <Drawer
      title="Download Excel"
      // width={500}
      onClose={() => setVisibleExcelDrawer(false)}
      open={visibleExcelDrawer}
      footer={
        <Button disabled={downloading} loading={downloading} type="primary" icon={<FileExcelOutlined />} style={{ marginLeft: 10 }} onClick={onDownloadExcel}>
          Download Now
      </Button>
      }
    >
      <Form
        form={formExcelDrawer}
        // {...formItemLayout}
        initialValues={Object.fromEntries(
          orderByFields.map(({ field, order }) => [field, order])
        )}
        layout="vertical"
      >
        <Form.Item
          label={'Column Name'}
          name={'orderByField'}
        >
            <Select
                options={orderByFields.sort((a, b) => a.field.localeCompare(b.field)).map((orderByField: any) => ({ value: orderByField.field, label: orderByField.field.replace('A.', '') }))}
                placeholder='Select column name'
                allowClear
                showSearch
            />
        </Form.Item>
        <Form.Item
              label={'Sort'}
              name={'orderBy'}
        >
          <Select
              options={[
                { value: 'asc', label: 'ASC' },
                { value: 'DESC', label: 'DESC' }
              ]}
              allowClear
              placeholder='Select sort A~Z or Z~A'
          />
        </Form.Item> 
        {/* {
          orderByFields.map((orderByField: any, index: number) => 
            <Form.Item
              label={orderByField.label}
              name={orderByField.field}
              key={index}
            >
              <Select
                  options={[
                    { value: 'asc', label: 'ASC' },
                    { value: 'DESC', label: 'DESC' }
                  ]}
              />
            </Form.Item> 
          )
        } */}
      </Form>
    </Drawer>

    <Drawer title="More Filter" placement="right" onClose={onHideDrawer} open={visibleDrawer}>
      <Form
          form={formDrawer}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
      >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <Form.Item
                  name="fiscalYear"
                  label="Period"
                  style={{flex: 1}}
              >
                  <DatePicker
                      picker="year"
                      style={{width: '100%'}}
                  />
              </Form.Item>
              <Form.Item
                  name="quarter"
                  style={{flex: 1, marginLeft: 15}}
              >
                  <Select
                      placeholder="Select quarter"
                      defaultValue={searchParams.get('quarter') ?? null}
                      options={options.cycles ?? []}
                      allowClear
                      style={{width: '100%'}}
                  />
              </Form.Item>
          </div>
          <Form.Item
              name="riskId"
              label="Risk ID"
          >
              <Select
                  placeholder="Select risk Id"
                  defaultValue={searchParams.get('riskId') ?? null}
                  options={options.riskIds ?? []}
                  allowClear
                  showSearch
              />
          </Form.Item>
          <Form.Item
              name="riskEvent"
              label="Risk Event"
          >
              <Select
                  placeholder="Select risk event"
                  defaultValue={searchParams.get('riskEvent') ?? null}
                  options={options.riskEvents ?? []}
                  allowClear
                  showSearch
              />
          </Form.Item>
          <Form.Item
              name="directorate"
              label="Directorate"
          >
              <Select
                  placeholder="Select directorate"
                  defaultValue={searchParams.get('directorate') ?? null}
                  options={options.directorates ?? []}
                  allowClear
                  showSearch
              />
          </Form.Item>
          <Form.Item
              name="department"
              label="Department"
          >
              <Select
                  placeholder="Select department"
                  defaultValue={searchParams.get('department') ?? null}
                  options={options.departments ?? []}
                  allowClear
                  showSearch
              />
          </Form.Item>
          <Form.Item>
              <Button 
                  loading={false} 
                  disabled={false} 
                  type="primary" 
                  htmlType="submit"
              >
                  Submit
              </Button>
          </Form.Item>
      </Form>
  </Drawer>
    <Col sm={24} md={12} xl={24}>
      <Table
        loading={loading}
        columns={columns} 
        dataSource={risks?.data ?? []}
        onChange={(pagination, filters, sorter: any) => {
          if (sorter.order) {
              fetchRisks({ sortColumn: sorter.field, sortType: sorter.order });
          }

          setSort({ sortColumn: sorter.field, sortType: sorter.order });
        }}
        bordered
        pagination={false}
        className="striped-table"
        footer={() => (
          <Pagination
              defaultCurrent={1}
              pageSize={risks.per_page}
              total={risks.total}
              showTotal={showTotal}
              onChange={onChangePageSize}
          />
        )}
      />
    </Col>
  </Row>)
}
