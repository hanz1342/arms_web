'use client'
import React, {useState} from "react";
import Swal from "sweetalert2";
import {
  Form,
  MenuProps,
  Dropdown,
  Table,
  Select,
  Row,
  Col,
  PageTitle,
  Input,
  Checkbox,
  Pagination,
  PaginationProps
} from "@/components";
import type { ColumnsType } from 'antd/es/table';
import Helper from "@/helper";
import { useRouter, useSearchParams } from "@/router";
import { PaginateResponse } from "@/responses";
import { getRisksAggDepartment, updateRiskAggDepartment, getSelectOptions } from "@/services";
import { RiskAggregationFilter } from "@/types";
import { SelectItem, TextAreaItem } from "@/components/form";
import { PlusOutlined } from "@/components/icons";
import Link from "next/link";
import { Sort } from "@/types/sort";

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

export default function Page() {
  const fiscalYear = (new Date().getFullYear());
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
  const [loading, setLoading] = React.useState(false)
  const [risks, setRisks] = React.useState<PaginateResponse>(new PaginateResponse())
  const instance = Helper.getInstance()
  const router = useRouter()
  const [form] = Form.useForm()

  const columns: ColumnsType<DataType> = [
    {
      title: 'Risk Category',
      dataIndex: 'RiskCategoryL1',
      key: 'RiskCategoryL1',
      children: [
        {
          title: 'Level 1',
          dataIndex: 'RiskCategoryL1',
          key: 'RiskCategoryL1'
        },
        {
          title: 'Level 2',
          dataIndex: 'RiskCategoryL2',
          key: 'RiskCategoryL2',
        },
        {
          title: 'Level 3',
          dataIndex: 'RiskCategoryL3',
          key: 'RiskCategoryL3',
          render: (riskCategoryL3: string, record: any) => {
            let params = `lv1=${record.RiskCategoryL1}&lv2=${record.RiskCategoryL2}&lv3=${record.RiskCategoryL3}`;
            params += `&fiscalYear=${record.FiscalYear}&department=${record.Department}&quarter=${record.Quarter}`;
            params += `&riskStatus=${record.RiskStatus}`;

            return <Link href={`/ra_departments/show?${params}`}>{riskCategoryL3}</Link>
          }
        },
      ]
    },
    {
      title: 'Inherent Risk',
      dataIndex: 'inherent_risk',
      key: 'inherent_risk',
      children:[
        {
          title: 'Impact',
          dataIndex: 'AvgInherentImpact',
          key: 'AvgInherentImpact',
        },
        {
          title: 'Likelihood',
          dataIndex: 'AvgInherentLikelihood',
          key: 'AvgInherentLikelihood',
        },
        {
          title: 'Score',
          dataIndex: 'AvgInherentScore',
          key: 'AvgInherentScore',
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
          dataIndex: 'AvgResidualImpact',
          key: 'AvgResidualImpact',
        },
        {
          title: 'Likelihood',
          dataIndex: 'AvgResidualLikelihood',
          key: 'AvgResidualLikelihood',
        },
        {
          title: 'Score',
          dataIndex: 'AvgResidualScore',
          key: 'AvgResidualScore',
        }
      ]
    },
    {
      title: 'Top Risk',
      dataIndex: 'DptPriority',
      key: 'DptPriority',
      width: 140,
      render: (DptPriority: string, _, index: number) => {
        const options = [
          { label: 'Not Assessed', value: 'Not Assessed' },
          { label: 'Yes', value: 'Yes' },
          { label: 'No', value: 'No' },
        ];

        return <SelectItem
          name={`DptPriority[${index}]`}
          placeholder="Fiscal Year"
          options={options}
          style={{ minWidth: 140 }}
        />
      }
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
      width: 160,
      render: (remark: string, _, index: number) => {
        return <TextAreaItem
          name={`aggRemarks[${index}]`}
          placeholder="Enter remark..."
          autoSize={{ minRows: 4 }}
        />;
      }
    }
  ];

  const searchParams = useSearchParams()

  React.useEffect(() => {
    const quarter = searchParams.get('quarter');
    const department = searchParams.get('department');

    if (quarter && department) {
      fetchRisksAggDepartment({fiscalYear, quarter, department});
    }

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

  const fetchRisksAggDepartment = (option?: RiskAggregationFilter) => {
    setLoading(true)
    getRisksAggDepartment(option)
    .then((response: any) => {
      if (response) {
        setRisks(response);
        response?.data?.forEach((risk: any, index: number) => {
          form.setFieldsValue({
            [`DptPriority[${index}]`]: ['Yes', 'No'].includes(risk.DptPriority) ? risk.DptPriority : 'Not Assessed',
            [`aggRemarks[${index}]`]: risk.AggRemarks
          });
        });
      }
    })
    .finally(() => setLoading(false))
  };

  const onSubmit = async () => {
    const values = await form.validateFields();
    const data = risks?.data?.map((risk: any, index: number) => {
      return {
        riskIds: risk.Risk_IDs,
        aggFlag: risk.AggFlag,
        dptPriority: values[`DptPriority[${index}]`],
        aggRemarks: values[`aggRemarks[${index}]`],
      };
    });
    
    updateRiskAggDepartment({
      risks: data
    })
    .then(() => {
      Swal.fire({
        icon: "success",
        title: "Your work has been saved",
        showConfirmButton: false,
        timer: 1500
      })
      .then(() => {
        // form.resetFields()
        // setRisks(new PaginateResponse());
        const quarter = searchParams.get('quarter');
        const department = searchParams.get('department');

        if (quarter && department) {
          fetchRisksAggDepartment({fiscalYear, quarter, department});
        }
      });
    })
  };

  const onChangeCycle = (quarter: string) => {
    const { queryParams, option } = instance.appendFilterParams(searchParams, 'quarter', quarter);

    router.push(`?${queryParams}`);

    if (option.quarter && option.department) {
      fetchRisksAggDepartment({ ...option, fiscalYear});
    }
  };

  const onChangeDepartment = (department: string) => {
    const { queryParams, option } = instance.appendFilterParams(searchParams, 'department', department);

    router.push(`?${queryParams}`);
    
    if (option.quarter && option.department) {
      fetchRisksAggDepartment({ ...option, fiscalYear });
    }
  };

  const items: MenuProps['items'] = [
    {
      label: 'Add New Risk',
      key: '1',
      icon: <PlusOutlined />,
      onClick: () => {
        if (Helper.getInstance().hasPermission('RISK.CREATE.NEW')) {
          router.replace('/risks/create?back=ra_departments')
        }
      }
    }
  ];

  /**
   * On Pagination Change Page
   * @param page 
   * @param pageSize 
   */
  const onChangePageSize = (page: number, pageSize: number) => {
    const { option } = Helper.getInstance().appendFilterParams(searchParams, 'page', page);
    const quarter = searchParams.get('quarter');
    const directorate = searchParams.get('directorate');

    if (sort?.sortColumn && sort.sortType) {
        option.sortColumn = sort.sortColumn;
        option.sortType = sort.sortType;
    }

    if (quarter && directorate) {
      option.quarter = quarter;
      option.directorate = directorate;
    }

    fetchRisksAggDepartment({ ...option, pageSize }); 
  }

  const menuProps = {
    items
  };

  const showTotal: PaginationProps['showTotal'] = (total, range) => `${range[0]}-${range[1]} of ${total} items`;
  
  return(<Row gutter={[16, 16]}>
    <Col sm={24} md={8} xl={8}>
        <PageTitle title='Risk Profile Form - Department Aggregation' />
    </Col>
    <Col sm={24} md={16} xl={16} style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Input
          name='fiscalYear'
          defaultValue={`Fiscal Year: ${fiscalYear}`}
          disabled
          style={{ width: 200 }}
        />
        <Select
          placeholder="Select cycle"
          onChange={onChangeCycle}
          options={options?.cycles ?? []}
          allowClear
          style={{ marginLeft: 15, minWidth: 150 }}
        />
        <Select
          placeholder="Select department"
          onChange={onChangeDepartment}
          options={options?.departments ?? []}
          allowClear
          showSearch
          style={{ marginLeft: 15, minWidth: 250 }}
        />
        <div>
            <Dropdown.Button type="primary" menu={menuProps} onClick={onSubmit} style={{ marginLeft: 15 }}>
              Submit
            </Dropdown.Button>
        </div>
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
          footer={() => 
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Form.Item name="disabled" valuePropName="checked" rules={[{ required: true, message: "Please confirm that this has been Discussed and consulted." }]}>
                <Checkbox>This has been discussed and consulted with direct superior and relevant personnel.</Checkbox>
              </Form.Item>
              <Pagination
                defaultCurrent={1}
                pageSize={risks.per_page}
                total={risks.total}
                showTotal={showTotal}
                onChange={onChangePageSize}
              />
          </div>
          }
        />
      </Form>
    </Col>
  </Row>)
}
