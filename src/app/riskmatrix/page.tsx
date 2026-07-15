'use client';

import React, { useState } from 'react';
import { 
   Row,
   Col,
   Select,
   Table,
   Button,
   Pagination,
   Card,
   Statistic,
   PageTitle,
   Input,
   PaginationProps,
   Drawer,
   Form,
   DatePicker,
   NoPermission
} from '@/components';
import { 
    CloseOutlined,
    FilterOutlined, 
    OrderedListOutlined, 
    SearchOutlined, 
    UnorderedListOutlined
 } from '@icons';
import { getSelectOptions } from '@services';
import { 
    getRiskMatrixCount, 
    getRiskMatrix, 
    getRiskSummaryDetail 
} from '@services/risk-matrix';
import './style.css';
import { PaginateResponse } from '@/responses';
import { useRouter, useSearchParams } from '@/router';
import { RiskMatrixFilter } from '@/types/risk-matrix';
import { RiskScoreType } from '@/enums';
import { RiskMatrixCell } from '@/components/risk-matrix';
import Helper from '@/helper';
import Link from 'next/link';

export default function Page() {
    if (Helper.getInstance().isRetricAccess('RISK.MATRIX.VIEW')) {
        return <NoPermission />;
    }

    const [options, setOptions] = useState({
        cycles: [],
        departments: [],
        directorates: [],
        divisions: [],
        aggregateFlages: []
    });
    
    const [state, setState] = useState({
        withRiskScore: 0,
        noRiskScore: 0,
        riskMatrixes: [],
        riskSummaryDetails: new PaginateResponse()
    });

    const [visibleDrawer, setVisibleDrawer] = React.useState(false);

    const instance = Helper.getInstance()
    const router = useRouter()
    const searchParams = useSearchParams()
    const [formDrawer] = Form.useForm()
    const [formFilter] = Form.useForm()
    let timer: any = null

    React.useEffect(() => {
        fetchSelectOptions();
        fetchRiskMatrixCount();
        fetchRiskMatrix();
        fetchRiskSummaryDetails();

        // Set default risk treatment type
        const riskScoreType = searchParams.get('riskScoreType');
        if (!riskScoreType) {
            router.push(`?riskScoreType=${RiskScoreType.INHERENT}`);
        }
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

    const fetchRiskMatrixCount = (option?: RiskMatrixFilter) => {
        getRiskMatrixCount(option)
        .then((response: any) => {
            if (response?.data) {
                setState((prevState: any) => ({
                    ...prevState,
                    ...response.data
                }));
            }
        })
        .finally(() => {});
    }

    const fetchRiskMatrix = (option?: RiskMatrixFilter) => {
        getRiskMatrix(option)
        .then((response: any) => {
            if (response?.data) {
                setState((prevState: any) => ({
                    ...prevState,
                    riskMatrixes: response.data
                }));
            }
        })
        .finally(() => {});
    };

    const fetchRiskSummaryDetails = (option?: RiskMatrixFilter) => {
        getRiskSummaryDetail(option)
        .then((response: any) => {
            if (response?.data) {
                setState((prevState: any) => ({
                    ...prevState,
                    riskSummaryDetails: response?.data
                }));
            }
        })
        .finally(() => {});
    }

    const fetchData = (option?: RiskMatrixFilter) => {
        fetchRiskMatrixCount(option);
        fetchRiskMatrix(option);
        fetchRiskSummaryDetails(option);
    }

    const onShowDrawer = () => {
        setVisibleDrawer(true);
    }

    const onHideDrawer = () => {
        setVisibleDrawer(false);
    }

    const onResetFilter = () => {
        router.push('?riskScoreType=InherentRM');
        
        formFilter.resetFields();

        fetchRiskMatrixCount();
        fetchRiskMatrix();
        fetchRiskSummaryDetails();
    }

    const onFinish = (values: any) => {
        const fiscalYear = values.fiscalYear?.format('YYYY') ?? '';
        const quarter = values.quarter ?? '';
        const directorate = values.directorate ?? '';
        const department = values.department ?? '';

        let queryParams = `fiscal_year=${fiscalYear}`
        queryParams += `&quarter=${quarter}`
        queryParams += `&directorate=${directorate}`
        queryParams += `&department=${department}`

        const InherentRM = searchParams.get('riskScoreType')
        if (InherentRM) queryParams += `&InherentRM=${InherentRM}`

        router.push(`?${queryParams}`)
        onHideDrawer()

        const option = {
            fiscalYear,
            quarter,
            directorate,
            department
        };

        fetchData(option);
    };

    const onChangeDirectorate = (directorate: string) => {
        const { queryParams, option } = instance.appendFilterParams(searchParams, 'directorate', directorate);

        router.push(`?${queryParams}`);

        fetchData(option);
    };

    const onChangeDivision = (division:string) => {
        const { queryParams, option } = instance.appendFilterParams(searchParams, 'division', division);

        router.push(`?${queryParams}`);

        fetchData(option);
    };

    const onChangeAggFlag = (aggFlag: string) => {
        const { queryParams, option } = instance.appendFilterParams(searchParams, 'aggFlag', aggFlag);

        router.push(`?${queryParams}`);

        fetchData(option);
    }

    const onChangeRiskScoreType = (riskScoreType: string) => {
        const { queryParams, option } = instance.appendFilterParams(searchParams, 'riskScoreType', riskScoreType);

        router.push(`?${queryParams}`);

        fetchRiskSummaryDetails(option);
        fetchRiskMatrix(option);
    }

    const onChangePageRiskDetail = (page: number, pageSize: number) => {
        fetchRiskSummaryDetails({ page, pageSize });
        router.push(`?page=${page}`)
    }

    const onSearchRiskDetail = (event: any) => {
        const search = event.target.value

        const { queryParams, option } = instance.appendFilterParams(searchParams, 'search', search);

        router.push(`?${queryParams}`)

        clearTimeout(timer)
        timer = setTimeout(() => {
            fetchRiskSummaryDetails(option)
        }, 1200)
    }

    const onChangeRiskScore = (riskScore: string) => {
        const riskScoreType = searchParams.get('riskScoreType');
        
        let iRiskScore = '';
        let rRiskScore = '';

        if (riskScoreType === RiskScoreType.INHERENT) {
            iRiskScore = riskScore;
        } else if (riskScoreType === RiskScoreType.RESIDUAL) {
            rRiskScore = riskScore;
        }

        const option: any = { iRiskScore, rRiskScore };

        let queryParams = `iRiskScore=${iRiskScore}&rRiskScore=${rRiskScore}`;

        if (riskScoreType) {
            queryParams += `&riskScoreType=${riskScoreType}`;
            option.riskScoreType = riskScoreType;
        }

        const directorate = searchParams.get('directorate');
        if (directorate) {
            queryParams += `&directorate=${directorate}`;
            option.directorate = directorate;
        }

        const division = searchParams.get('division');
        if (division) {
            queryParams += `&division=${division}`;
            option.division = division;
        }

        const aggFlag = searchParams.get('aggFlag');
        if (aggFlag) {
            queryParams += `&aggFlag=${aggFlag}`;
            option.aggFlag = aggFlag;
        }

        const fiscalYear = searchParams.get('fiscal_year');
        if (aggFlag) {
            queryParams += `&fiscalYear=${fiscalYear}`;
            option.fiscalYear = fiscalYear;
        }

        const quarter = searchParams.get('quarter');
        if (aggFlag) {
            queryParams += `&quarter=${quarter}`;
            option.quarter = quarter;
        }

        router.push(`?${queryParams}`);
        
        fetchRiskSummaryDetails(option);
    }
    
    const riskMatrixColumns: any[] = [
        {
            title: '',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: '1 - Very Low',
            dataIndex: 'veryLow',
            key: 'veryLow',
            className: 'rm-row',
            align: 'center',
            render: (riskScore: number, _: any, index: number) => {
                let className = '';
                let status = 'Medium';

                if (index == 0) {
                    className = 'rm-meduim';
                } else {
                    className = 'rm-minor';
                    status = 'Minor';
                }

                return <RiskMatrixCell
                    status={status}
                    riskScoreCount={riskScore}
                    className={className}
                    onClick={() => onChangeRiskScore(`1${5 - index}`)}
                />;
            }
        },
        {
            title: '2 - Low',
            dataIndex: 'low',
            key: 'low',
            className: 'rm-row',
            align: 'center',
            render: (riskScore: number, _: any, index: number) => {
                let className = '';
                let status = 'Significant';

                if (index == 0) {
                    className = 'rm-significant';
                } else if (index == 1) {
                    className = 'rm-meduim';
                    status = 'Medium';
                } else {
                    className = 'rm-minor';
                    status = 'Minor';
                }

                return <RiskMatrixCell
                    status={status}
                    riskScoreCount={riskScore}
                    className={className}
                    onClick={() => onChangeRiskScore(`2${5 - index}`)}
                />;
            }
        },
        {
            title: '3 - Moderate',
            dataIndex: 'moderate',
            key: 'moderate',
            className: 'rm-row',
            align: 'center',
            render: (riskScore: number, _: any, index: number) => {
                let className = '';
                let status = 'Significant';

                if (index == 0 || index == 1) {
                    className = 'rm-significant';
                } else if (index == 4) {
                    className = 'rm-minor';
                    status = 'Minor';
                } else {
                    className = 'rm-meduim';
                    status = 'Medium';
                }

                return <RiskMatrixCell
                    status={status}
                    riskScoreCount={riskScore}
                    className={className}
                    onClick={() => onChangeRiskScore(`3${5 - index}`)}
                />;
            }
        },
        {
            title: '4 - High',
            dataIndex: 'high',
            key: 'high',
            className: 'rm-row',
            align: 'center',
            render: (riskScore: number, _: any, index: number) => {
                let className = '';
                let status = 'Very Significant';

                if (index == 0 || index == 1) {
                    className = 'rm-very-significant';
                } else if (index == 2 || index == 3) {
                    className = 'rm-significant';
                    status = 'Significant';
                } else {
                    className = 'rm-meduim';
                    status = 'Medium';
                }

                return <RiskMatrixCell
                    status={status}
                    riskScoreCount={riskScore}
                    className={className}
                    onClick={() => onChangeRiskScore(`4${5 - index}`)}
                />;
            }
        },
        {
            title: '5 - Very High',
            dataIndex: 'veryHigh',
            key: 'veryHigh',
            className: 'rm-row',
            align: 'center',
            render: (riskScore: number, _: any, index: number) => {
                const className = 'rm-very-significant';
                const status = 'Very Significant';

                return <RiskMatrixCell
                    status={status}
                    riskScoreCount={riskScore}
                    className={className}
                    onClick={() => onChangeRiskScore(`5${5 - index}`)}
                />;
            }
        },
    ];

    const columnsDetail: any = [
      {
          title: 'Risk ID',
          dataIndex: 'riskId',
          key: 'riskId',
          render: (riskId: string) => <div>
                {riskId}<Link href={`/risk_detail/${riskId}?back=riskmatrix`} className='view-link' style={{marginLeft: 15}}>View</Link>
            </div>
      },
      {
          title: 'Event',
          dataIndex: 'riskEvent',
          key: 'riskEvent',
          width: '22%'
      },
      {
          title: 'Department',
          dataIndex: 'department',
          key: 'department',
          width: '22%'
      },
      {
          title: 'Directorate',
          dataIndex: 'directorate',
          key: 'directorate',
      },
      {
          title: 'Division',
          dataIndex: 'division',
          key: 'division',
      },
      {
          title: 'Inherent Risk Score',
          dataIndex: 'inherentRiskScore',
          key: 'inherentRiskScore',
          align: 'center',
      },
      {
          title: 'Residual Risk Score',
          dataIndex: 'residualRiskScore',
          key: 'residualRiskScore',
          align: 'center',
      },
    ];

    const {
        noRiskScore, 
        withRiskScore, 
        riskMatrixes, 
        riskSummaryDetails
    } = state;

    const showTotal: PaginationProps['showTotal'] = (total, range) => `${range[0]}-${range[1]} of ${total} items`;

    const currentFilters = Helper.getInstance().getCurrentFilters(searchParams);

    return <Row gutter={[16, 16]}>
        <Col sm={24} md={4} xl={4}>
            <PageTitle title='Risk Matrix' />
        </Col>
        <Col sm={24} md={20} xl={20} style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Form form={formFilter} layout='inline'>
                <Form.Item name='directorate'>
                    <Select
                        placeholder="Select directorate"
                        // defaultValue={searchParams.get('directorate') ?? null}
                        options={options?.directorates ?? []}
                        onChange={onChangeDirectorate}
                        style={{minWidth: 200}}
                        allowClear
                    />
                </Form.Item>
                <Form.Item name='division'>
                    <Select
                        placeholder="Select division"
                        // defaultValue={searchParams.get('division') ?? null}
                        options={options?.divisions ?? []}
                        onChange={onChangeDivision}
                        style={{ marginLeft: 15, minWidth: 200 }}
                        allowClear
                    />
                </Form.Item>
                <Form.Item name='aggregateFlage'>
                    <Select
                        placeholder="Select aggregate flag"
                        // defaultValue={searchParams.get('aggFlag') ?? null}
                        options={options?.aggregateFlages ?? []}
                        onChange={onChangeAggFlag}
                        style={{ marginLeft: 15, minWidth: 150 }}
                    />
                </Form.Item>
                <Select
                    defaultValue="InherentRM"
                    onChange={onChangeRiskScoreType}
                    options={[
                        {
                            value: 'InherentRM',
                            label: 'Inherent Risk Matrix',
                        },
                        {
                            value: 'ResidualRM',
                            label: 'Residual Risk Matrix'
                        }
                    ]}
                    style={{ marginLeft: 15, minWidth: 150 }}
                />

                <Button icon={<FilterOutlined />} style={{ marginLeft: 10 }} onClick={onShowDrawer}>
                    More Filter
                </Button>

                <Button icon={<CloseOutlined />} style={{ marginLeft: 10 }} onClick={onResetFilter}>
                    Reset Filter {Object.keys(currentFilters).length > 0 ? `(${Object.keys(currentFilters).length})` : ''}
                </Button>
            </Form>
        </Col>

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

        <Col sm={24} md={12} xl={12}>
            <Card bordered={false}>
                <Statistic
                    title="Number of Risk with Rating"
                    value={withRiskScore}
                    precision={0}
                    valueStyle={{ color: '#3f8600' }}
                    prefix={<OrderedListOutlined />}
                />
            </Card>
        </Col>
        <Col sm={24} md={12} xl={12}>
            <Card bordered={false}>
                <Statistic
                    title="Number of Risk with no Risk Score"
                    value={noRiskScore}
                    precision={0}
                    valueStyle={{ color: '#cf1322' }}
                    prefix={<UnorderedListOutlined />}
                />
            </Card>
        </Col>
        
        <Col sm={24} md={24} xl={24} style={{marginTop: 15}}>
            <PageTitle title='Residual Risk Matrix' />
        </Col>

        <Col sm={24} md={24} xl={24}>
            <Table
                bordered
                dataSource={riskMatrixes} 
                columns={riskMatrixColumns}
                pagination={false}
                scroll={{
                    x: 300,
                }}
            />
        </Col>

        <Col sm={24} md={6} xl={6} style={{marginTop: 15}}>
            <PageTitle title='Impact Risk Treatment Details' />
        </Col>
        <Col sm={24} md={18} xl={18} style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Input placeholder="Search..." prefix={<SearchOutlined />} allowClear style={{ width: 300}} onChange={onSearchRiskDetail} />
        </Col>

        <Col sm={24} md={24} xl={24}>
            <Table
                dataSource={riskSummaryDetails.data}
                columns={columnsDetail}
                pagination={false}
                className="striped-table"
                scroll={{
                    x: 300
                }}
                footer={() => (
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Pagination
                            defaultCurrent={1}
                            pageSize={riskSummaryDetails?.per_page}
                            total={riskSummaryDetails?.total}
                            showTotal={showTotal}
                            onChange={onChangePageRiskDetail}
                        />
                    </div>
                )}
            />
        </Col>
    </Row>;
}