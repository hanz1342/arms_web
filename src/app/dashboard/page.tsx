'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import {
    Button,
    Card,
    Col,
    Drawer,
    DatePicker,
    Form,
    Input,
    Pagination,
    Row,
    Select,
    Spin,
    Statistic,
    Table
} from '@/components';
import type { PaginationProps } from '@/components';
import {
    CalendarOutlined,
    CheckOutlined,
    CloseOutlined,
    FieldTimeOutlined,
    FilterOutlined,
    LoadingOutlined,
    OrderedListOutlined,
    RollbackOutlined,
    SearchOutlined
} from '@icons';
import { useRouter, useSearchParams } from '@router';
import { getDashboardData, getRiskSummary, getRiskDetail } from '@/services/dashboard';
import DoughnutChart from '@/components/chart/doughnut-chart';
import './style.css';
import Helper from '@/helper';
import { DashboardFilter } from '@/types/dashboard';
import { RiskDetailResponse, RiskSummaryResponse } from '@/responses';


export default function Page() {
    const [state, setState] = useState<any>({
        option: {},
        riskCount: {},
        riskSummaries: new RiskSummaryResponse(),
        riskTreatmentByCategories: [],
        riskTreatmentDetails: new RiskDetailResponse()
    });

    let timer: any = null;

    const [visibleDrawer, setVisibleDrawer] = useState(false);
    const [loading, setLoading] = useState(false);
    const [rsLoading, setRSLoading] = useState(false);
    const [rsdLoading, setRSDLoading] = useState(false);

    const router = useRouter()
    const searchParams = useSearchParams()
    const [formDrawer] = Form.useForm()

    React.useEffect(() => {
        featchDashboardData();

        // Set default risk treatment type
        const rmType = searchParams.get('rmType');
        if (!rmType) {
            router.push('?rmType=ImpactRT');
        }

    }, [])

    const featchDashboardData = (option?: DashboardFilter) => {
        setLoading(true);
        getDashboardData(option)
        .then((response: any) => {
            if (response && response?.data) {
                const data = response.data;
                setState((prevState: any) => ({
                    ...prevState,
                    option: data.options,
                    riskCount: Helper.getInstance().transformArrayToObject(data.riskCount),
                    riskSummaries: data.riskSummaries,
                    riskTreatmentByCategories: data.riskTreatmentByCategories,
                    riskTreatmentDetails: data.riskTreatmentDetails
                }));
            }
        })
        .finally(() => {
            setLoading(false);
        });
    }

    const fetchRiskSummary = (option?: DashboardFilter) => {
        setRSLoading(true);
        getRiskSummary(option)
        .then((response: any) => {
            if (response && response?.data) {
                const data = response.data;

                setState((prevState: any) => ({
                    ...prevState,
                    riskSummaries: data
                }));
            }
        })
        .finally(() => {
            setRSLoading(false);
        });
    }

    const fetchRiskDetail = (option?: DashboardFilter) => {
        setRSDLoading(true);
        getRiskDetail(option)
        .then((response: any) => {
            if (response && response?.data) {
                const data = response.data;

                setState((prevState: any) => ({
                    ...prevState,
                    riskTreatmentDetails: data
                }));
            }
        })
        .finally(() => {
            setRSDLoading(false);
        });
    }

    const onShowDrawer = () => {
        setVisibleDrawer(true);
    }

    const onHideDrawer = () => {
        setVisibleDrawer(false);
    }

    const onResetFilter = () => {
        const currentFilters = Helper.getInstance().getCurrentFilters(searchParams);
        Object.keys(currentFilters).forEach((key: string) => {

        });
        
        router.push('?rmType=ImpactRT');

        featchDashboardData();
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

        const rmType = searchParams.get('rmType')
        if (rmType) queryParams += `&rmType=${rmType}`

        router.push(`?${queryParams}`)
        onHideDrawer()

        featchDashboardData({
            fiscalYear,
            quarter,
            directorate,
            department
        })
    };

    const onChangeCategory = (category: string) => {
        featchDashboardData({ category });

        let queryParams = `category=${category || ''}`;

        const division = searchParams.get('division');
        if (division) queryParams += `&division=${division}`;

        const status = searchParams.get('status');
        if (status) queryParams += `&status=${status}`;

        const rmType = searchParams.get('rmType');
        if (rmType) queryParams += `&rmType=${rmType}`;

        router.push(`?${queryParams}`);
    };

    const onChangeDivision = (division:string) => {
        featchDashboardData({ division });

        let queryParams = `division=${division}`;

        const category = searchParams.get('category');
        if (category) queryParams += `&category=${category}`;

        const status = searchParams.get('status');
        if (status) queryParams += `&status=${status}`;

        const rmType = searchParams.get('rmType');
        if (rmType) queryParams += `&rmType=${rmType}`;

        router.push(`?${queryParams}`);
    };

    const onChangeStatus = (status: string) => {
        featchDashboardData({ status });

        let queryParams = `status=${status}`;

        const category = searchParams.get('category');
        if (category) queryParams += `&category=${category}`;

        const division = searchParams.get('division');
        if (division) queryParams += `&division=${division}`;

        const rmType = searchParams.get('rmType');
        if (rmType) queryParams += `&rmType=${rmType}`;

        router.push(`?${queryParams}`);
    }

    const onChangeRiskTreatment = (rmType: string) => {
        featchDashboardData({ rmType });

        let queryParams = `rmType=${rmType}`;

        const category = searchParams.get('category');
        if (category) {
            queryParams += `&category=${category}`
        };

        router.push(`?${queryParams}`);
    }

    // Risk Summary
    const onSearchRiskSummary = (event: any) => {
        const rmType: any = searchParams.get('rmType')
        const search = event.target.value
        router.push(`?rs_search=${search}&rmType=${rmType}`)

        clearTimeout(timer)
        timer = setTimeout(() => {
            fetchRiskSummary({ search })
        }, 1200)
    }

    const onChangePageRiskSummary = (page: number, pageSize: number) => {
        const rmType: any = searchParams.get('rmType')

        fetchRiskSummary({ page, pageSize, rmType });
        router.push(`?rs_page=${page}&rmType=${rmType}`)
    }

    // Risk Detail
    const onSearchRiskDetail = (event: any) => {
        const rmType: any = searchParams.get('rmType')
        const search = event.target.value
        router.push(`?rsd_search=${search}&rmType=${rmType}`)

        clearTimeout(timer)
        timer = setTimeout(() => {
            fetchRiskDetail({ search })
        }, 1200)
    }

    const onChangePageRiskDetail = (page: number, pageSize: number) => {
        const rmType: any = searchParams.get('rmType')

        fetchRiskDetail({ page, pageSize, rmType })
        router.push(`?rsd_page=${page}&rmType=${rmType}`, {scroll: false})
    }

    const riskSummaryColumns = [
        {
            title: 'Risk ID',
            dataIndex: 'riskId',
            width: 200,
            sorter: (a: any, b: any) => a.riskId.length - b.riskId.length,
            render: (riskId: string) => <div>
                {riskId}<Link href={`/risk_detail/${riskId}`} className='view-link' style={{marginLeft: 15, display: 'none'}}>View</Link>
            </div>
        },
        {
            title: 'Risk Event',
            dataIndex: 'riskEvent',
            sorter: (a: any, b: any) => a.riskEvent.length - b.riskEvent.length,
            render: (riskEvent: string) => {
                return <div className='text-risk-event'>
                    {riskEvent}
                </div>
            }
        },
        {
            title: 'Impact',
            dataIndex: 'impRiskTreatment',
            sorter: (a: any, b: any) => a.impRiskTreatment - b.impRiskTreatment,
            width: 150,
        },
        {
            title: 'Likelihood',
            dataIndex: 'likRiskTreatment',
            sorter: (a: any, b: any) => a.likRiskTreatment - b.likRiskTreatment,
            width: 150,
          },
    ];

    const riskTreatmentDetailColumns = [
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            width: 160,
            sorter: (a: any, b: any) => a.category.length - b.category.length,
        },
        {
            title: 'Information',
            dataIndex: 'description',
            key: 'description',
            sorter: (a: any, b: any) => a.description.length - b.description.length,
        },
        {
            title: 'Remarks',
            dataIndex: 'remarks',
            key: 'remarks',
            sorter: (a: any, b: any) => a.remarks.length - b.remarks.length,
        },
        {
            title: 'Focal Point',
            dataIndex: 'pic',
            key: 'pic',
            width: 200,
            sorter: (a: any, b: any) => a.pic.length - b.pic.length,
        },
        {
            title: 'Cost (USD)',
            dataIndex: 'cost',
            key: 'cost',
            width: 150,
            sorter: (a: any, b: any) => a.cost.length - b.cost.length,
        },
        {
            title: 'Due Date',
            dataIndex: 'dueDate',
            key: 'dueDate',
            width: 150,
            sorter: (a: any, b: any) => a.dueDate.length - b.dueDate.length,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 150,
            sorter: (a: any, b: any) => a.status.length - b.status.length,
        },
    ];

    const showTotal: PaginationProps['showTotal'] = (total, range) => `${range[0]}-${range[1]} of ${total} items`;

    const { 
        option, 
        riskCount, 
        riskSummaries, 
        riskTreatmentByCategories, 
        riskTreatmentDetails 
    } = state;

    const currentFilters = Helper.getInstance().getCurrentFilters(searchParams);

    const prefixRiskTitle = searchParams.get('rmType') == 'ImpactRT' ? 'Impact' : 'Likelihood';
    
    return (<Spin spinning={loading}>
        <div className="main-home">
            <section className="risk-treatment-status">
                <div className="header">
                    <span className="title">Impact Risk Treatment Status</span>
                    <div className="btn-right-select">
                        <Select
                            className="btn-right-filter"
                            placeholder="Select category"
                            defaultValue={searchParams.get('category') ?? null}
                            onChange={onChangeCategory}
                            options={option?.categories ? option.categories : []}
                            allowClear
                            style={{minWidth: 150}}
                        />

                        <Select
                            className="btn-right-filter"
                            placeholder="Select division"
                            defaultValue={searchParams.get('division') ?? null}
                            onChange={onChangeDivision}
                            options={option?.divisions ? option.divisions : []}
                            allowClear
                            style={{minWidth: 200}}
                        />

                        <Select
                            className="btn-right-filter"
                            placeholder="Select status"
                            defaultValue={searchParams.get('status') ?? null}
                            onChange={onChangeStatus}
                            options={option?.statuses ? option.statuses : []}
                            allowClear
                            style={{minWidth: 150}}
                        />

                        <Select
                            className="btn-right-filter"
                            defaultValue={searchParams.get('rmType') ?? 'ImpactRT'}
                            onChange={onChangeRiskTreatment}
                            options={option?.riskTreatmentFors ? option.riskTreatmentFors : []}
                        />

                        <Button icon={<FilterOutlined />} onClick={onShowDrawer}>
                            More Filter
                        </Button>

                        <Button icon={<CloseOutlined />} style={{ marginLeft: 10 }} onClick={onResetFilter}>
                            Reset Filter {Object.keys(currentFilters).length > 0 ? `(${Object.keys(currentFilters).length})` : ''}
                        </Button>

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
                                            options={option?.cycles ?? []}
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
                                        options={option?.directorates ?? []}
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
                                        options={option?.departments ?? []}
                                        allowClear
                                        showSearch
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <Button 
                                        loading={loading} 
                                        disabled={loading} 
                                        type="primary" 
                                        htmlType="submit"
                                    >
                                        Submit
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Drawer>
                    </div>
                </div>
                <div className="box">
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={24} md={12} xl={4}>
                            <Card bordered={false}>
                                <Statistic
                                title="Done"
                                value={riskCount?.Done}
                                precision={0}
                                valueStyle={{ color: '#3f8600' }}
                                prefix={<CheckOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={24} md={12} xl={4}>
                            <Card bordered={false}>
                                <Statistic
                                    title="Cancelled"
                                    value={riskCount['Cancelled']}
                                    precision={0}
                                    valueStyle={{ color: '#cf1322' }}
                                    prefix={<RollbackOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={24} md={12} xl={4}>
                            <Card bordered={false}>
                                <Statistic
                                    title="Not Started"
                                    value={riskCount['Not Started']}
                                    prefix={<OrderedListOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={24} md={12} xl={4}>
                            <Card bordered={false}>
                                <Statistic
                                    title="In Progress"
                                    value={riskCount['In Progress']}
                                    valueStyle={{ color: '#1677ff' }}
                                    prefix={<LoadingOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={24} md={12} xl={4}>
                            <Card bordered={false}>
                                <Statistic
                                    title="Near Due Date"
                                    value={riskCount['Near Due Date']}
                                    valueStyle={{ color: '#faad14' }}
                                    prefix={<CalendarOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col  xs={24} sm={24} md={12} xl={4}>
                            <Card bordered={false}>
                                <Statistic
                                    title="Overdue"
                                    value={riskCount['Overdue']}
                                    valueStyle={{ color: '#cf1322' }}
                                    prefix={<FieldTimeOutlined />}
                                />
                            </Card>
                        </Col>
                    </Row>
                </div>
            </section>
            <section className="risk-summary">
                <Row gutter={[16,16]}>
                    <Col xs={24} sm={24} md={24} xl={18} lg={18}>
                        <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 className="title">Risk Summary</h2>
                            <div>
                                <Input placeholder="Search..." prefix={<SearchOutlined />} allowClear onChange={onSearchRiskSummary} />
                            </div>
                        </div>
                        <div className="table-content">
                            <Table
                                loading={rsLoading}
                                columns={riskSummaryColumns}
                                dataSource={riskSummaries.data}
                                pagination={false}
                                scroll={{
                                    y: 255,
                                }}
                                footer={() => (
                                    <div className="main-footer">
                                        <Pagination
                                            defaultCurrent={1}
                                            pageSize={riskSummaries.per_page}
                                            total={riskSummaries.total}
                                            showTotal={showTotal}
                                            onChange={onChangePageRiskSummary}
                                        />
                                    </div>
                                )}
                            />
                        </div>
                    </Col>
                    <Col xs={24} sm={24} md={24} xl={6} lg={6}>
                        <div className="main-risk-treatment-category">
                            <div className="header">
                                <h2 className="title">{prefixRiskTitle} Risk Treatment Category</h2>
                            </div>
                            <div className="chat-content">
                                {riskTreatmentByCategories.length > 0 && <DoughnutChart categories={riskTreatmentByCategories}  />}
                            </div>
                        </div>
                    </Col>
                </Row>
            </section>
            <section className="risk-treatment-detail">
                <div className="main-table">
                    <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 className="title">{prefixRiskTitle} Risk Treatment Details</h2>
                        <div>
                            <Input placeholder="Search..." prefix={<SearchOutlined />} allowClear onChange={onSearchRiskDetail} />
                        </div>
                    </div>
                    <div className="table-detail">
                        <Table
                            loading={rsdLoading}
                            dataSource={riskTreatmentDetails.data}
                            columns={riskTreatmentDetailColumns}
                            pagination={{
                                defaultCurrent: 1,
                                pageSize: riskTreatmentDetails.per_page,
                                total: riskTreatmentDetails.total,
                                onChange: onChangePageRiskDetail
                            }}
                            rowKey="key"
                            scroll={{
                                y: 400,
                            }}
                            className="striped-table"
                        />
                    </div>
                </div>
            </section>
        </div>
    </Spin>
  )
}
