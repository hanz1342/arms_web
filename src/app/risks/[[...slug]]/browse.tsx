'use client'
import React, { useState } from "react";
import {
  Button,
  Table,
  Input,
  Pagination,
  PaginationProps,
  Col,
  PageTitle,
  Row,
  Tag,
  Select,
  NoPermission
} from '@/components';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  ImportOutlined
} from '@icons';
import type { ColumnsType } from 'antd/es/table';
import { getRisks } from "@/services";
import { PaginateResponse } from "@/responses";
import Helper from "@/helper";
import { useRouter, useSearchParams } from "@/router";
import { RiskDetailFilter } from "@/types/risk-detail";
import Link from "next/link";
import { Sort } from "@/types/sort";

interface DataType {
  key: React.Key;
  riskId: string;
  riskStatus: string;
  fiscalYear: string;
  quarter: string;
  riskEvent: string;
  facalYear: string;
  department: string;
  directorate: string;
  division: string;
  objectives: string;
  inherentRiskScore: string;
  inherentRiskScoreDescription: string;
  residualRiskScore: number;
  residualRiskScoreDescription: string;
}

export default function Browse() {
  if (Helper.getInstance().isRetricAccess('RISK.MATRIX.VIEW')) {
    return <NoPermission />;
  }

  const [sort, setSort] = React.useState<Sort>();
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = React.useState<PaginateResponse>(new PaginateResponse());
  const router = useRouter();
  const searchParams = useSearchParams();
  let timer: any = null;

  React.useEffect(() => {
    fetchData()
  }, []);

  const fetchData = (option?: RiskDetailFilter) => {
    getRisks(option)
    .then((response: any) => {
        if (response) {
          setData(response);
        }
    })
    .catch((error: any) => {
        console.log(error);
    })
    .finally(() => {
        setLoading(false);
    })
  }

  const onSearch = (event: any) => {
      const search = event.target.value;
      const { option, queryParams } = Helper.getInstance().appendFilterParams(searchParams, 'search', search);

      clearTimeout(timer);
      timer = setTimeout(() => {
          router.push(`?${queryParams}`);
          fetchData(option);
      }, 1200);
  };

  const onChangeFilterStatus = (riskStatuses: string[]) => {
    const { option } = Helper.getInstance().appendFilterParams(searchParams, 'riskStatuses', riskStatuses);
      fetchData({ ...option, riskStatuses }); 
  };

  /**
   * On Pagination Change Page
   * @param page 
   * @param pageSize 
   */
  const onChangePageSize = (page: number, pageSize: number) => {
      const { option } = Helper.getInstance().appendFilterParams(searchParams, 'page', page);

      if (sort?.sortColumn && sort.sortType) {
        option.sortColumn = sort.sortColumn;
        option.sortType = sort.sortType;
      }
      
      fetchData({ ...option, pageSize }); 
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'Action',
      key: 'riskId',
      dataIndex: 'riskId',
      width: 60,
      render: (riskId: number) => (
          <div className="render-icon">
            <Link href={`/risks/edit/${riskId}`}>
              <Button
                type="primary"
                className="circle-icon-edit"
                shape="circle"
                icon={<EditOutlined />}
              />
            </Link>
          </div>
      )
    },
    {
      title: 'Risk ID',
      dataIndex: 'riskId',
      sorter: true,
      defaultSortOrder: 'ascend',
    },
    {
      title: 'Status',
      dataIndex: 'riskStatus',
      sorter: true,
      render: (status: string) => {
        if (status === "Active") return <Tag color="#87d068" style={{ minWidth: 70, textAlign: "center" }}>{status}</Tag>;
        if (status === "Cancelled") return <Tag color="#ff0000" style={{ minWidth: 70, textAlign: "center" }}>{status}</Tag>;
        if (status === "Draft") return <Tag style={{ minWidth: 70, textAlign: "center" }}>{status}</Tag>;
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
    // {
    //   title: 'Department',
    //   dataIndex: 'department',
    //   key: 'department',
    //   width: 500,
    //   sorter: (a, b) => a.department.length - b.department.length,
    // },
    {
      title: 'Diractorate',
      dataIndex: 'directorate',
      key: 'directorate',
      width: 500,
      sorter: true,
    },
    {
      title: 'Division',
      dataIndex: 'division',
      key: 'division',
      width: 500,
      sorter: true,
    },
    // {
    //   title: 'Objectives',
    //   dataIndex: 'objectives',
    //   key: 'objectives',
    //   sorter: (a, b) => a.objectives.length - b.directorate.length,
    // },
    // {
    //   title: 'Risk Event',
    //   dataIndex: 'riskEvent',
    //   sorter: (a, b) => a.riskEvent.length - b.riskEvent.length,
    //   render: (riskEvent: string) => <div className='text-risk-event'>{riskEvent}</div>
    // },
    {
      title: 'Inherent Risk',
      dataIndex: 'inherentRisk',
      key: 'inherentRiskScore',
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
      dataIndex: 'residualRisk',
      key: 'residualRisk',
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

  const showTotal: PaginationProps['showTotal'] = (total, range) => `${range[0]}-${range[1]} of ${total} items`;

  return (<Row gutter={[16, 16]}>
    <Col sm={24} md={6} xl={6}>
      <PageTitle title={'Risks Management'} />
    </Col>

    <Col sm={24} md={18} xl={18} style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Input placeholder="Search..." style={{ width: 300, marginRight: 15 }} prefix={<SearchOutlined />} allowClear onChange={onSearch} />
        <Select
          mode="multiple"
          allowClear
          style={{ width: 300, marginRight: 15 }}
          placeholder="Please select"
          defaultValue={['Active', 'Draft', 'Cancelled']}
          onChange={onChangeFilterStatus}
          options={[
            { label: 'Active', value: 'Active' },
            { label: 'Draft', value: 'Draft' },
            { label: 'Cancelled', value: 'Cancelled' },
          ]}
        />
        <Button
            icon={<ImportOutlined />}
            style={{ marginRight: 15 }}
            onClick={() => {
              if (Helper.getInstance().hasPermission('RISK.IMPORT')) {
                router.push('/risks/import')
              }
            }}
          >
          Import Risk
        </Button>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => router.push('/risks/create')}>
            Add New
        </Button>
    </Col>

    <Col sm={24} md={24} xl={24}>
      <Table
        loading={loading}
        columns={columns}
        dataSource={data?.data ?? []}
        onChange={(pagination, filters, sorter: any) => {
          if (sorter.order) {
            fetchData({ sortColumn: sorter.field, sortType: sorter.order });
          }

          setSort({ sortColumn: sorter.field, sortType: sorter.order });
        }}
        pagination={false}
        rowKey={'riskId'}
        scroll={{ x: 1500 }}
        footer={() => (
          <Pagination
              defaultCurrent={1}
              pageSize={data.per_page}
              total={data.total}
              showTotal={showTotal}
              onChange={onChangePageSize}
          />
        )}
      />
    </Col>
  </Row>)
}
