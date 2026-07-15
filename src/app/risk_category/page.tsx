'use client';
import React, { useState } from "react";
import Swal from "sweetalert2";
import { Table, Button, Input, Col, Row, PageTitle, Pagination, PaginationProps, ConfirmDelete, NoPermission } from '@/components';
import { EditOutlined, PlusOutlined, SearchOutlined } from '@icons';
import type { ColumnsType } from 'antd/es/table';
import { useRouter, useSearchParams } from '@router';
import './style.css';
import { RiskCategoryFilter, RiskCategoryInterface, } from "@/types/risk-category";
import { getRiskCategory, deleteRiskCategoryById } from "@/services";
import CategoryForm from "./form";
import { PaginateResponse } from "@/responses";
import Helper from "@/helper";
import { Sort } from "@/types/sort";

const Page = () => {
    if (Helper.getInstance().isRetricAccess('RISK.CATEGORY.VIEW')) {
        return <NoPermission />;
    }

    const router = useRouter();

    const [sort, setSort] = React.useState<Sort>();
    const [loading, setLoading] = useState<boolean>(true);
    const [deleting, setDeleting] = useState<boolean>(false);
    const [categories, setCategories] = React.useState<PaginateResponse>(new PaginateResponse);
    const searchParams = useSearchParams();
    let timer: any = null;

    const ref = React.useRef({ open: (id?: number) => {} });

    React.useEffect(() => {
        fetchCategory()
    }, []);

    const deleteById = (id: number) => {
        setDeleting(true)
        deleteRiskCategoryById(id)
        .then((response: any) => {
            if (response?.error === 'RECORD.LINKED') {
                Swal.fire({
                    icon: "error",
                    title: "This risk category linked to other risk",
                    showConfirmButton: false,
                    timer: 1500
                })
                .then(() => {
                    fetchCategory();
                });
            } else {
                Swal.fire({
                    icon: "success",
                    title: "You've deleted",
                    showConfirmButton: false,
                    timer: 1500
                })
                .then(() => {
                    fetchCategory();
                });
            }
        })
        .finally(() => {
            setDeleting(false);
        });
    }

    const onSearch = (event: any) => {
        const search = event.target.value;
        const { option, queryParams } = Helper.getInstance().appendFilterParams(searchParams, 'search', search);

        clearTimeout(timer);
        timer = setTimeout(() => {
            router.push(`?${queryParams}`);
            fetchCategory(option);
        }, 1200);
    };

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

        fetchCategory({ ...option, pageSize });
    }

    /**
     * Fetch Risk Category
     * @param option 
     */
    const fetchCategory = (option?: RiskCategoryFilter) => {
        getRiskCategory(option)
            .then((response: any) => {
                if (response?.data) {
                    setCategories(response?.data);
                }
            })
            .catch((error: any) => {
                console.log('DDDDD:', error);
            })
            .finally(() => {
                setLoading(false)
            })
    }

    /**
     *  columns for table 
     */
    const columns: ColumnsType<RiskCategoryInterface> = [
        {
            title: 'Level 1',
            dataIndex: 'Level1',
            key: "Level1",
            sorter: true,
            defaultSortOrder: 'ascend'
        },
        {
            title: 'Level 2',
            dataIndex: 'Level2',
            key: "Level2",
            sorter: true,
        },
        {
            title: 'Level 3',
            dataIndex: 'Level3',
            key: 'Level3',
            sorter: true,
        },
        {
            title: 'Status',
            dataIndex: 'Enabled',
            key: 'Enabled',
            sorter: true,
        },
        {
            title: 'Action',
            key: 'RCatID',
            dataIndex: 'RCatID',
            render: (id: any, record: any) => {
                record.id = record.RCatID;
                return <div className="render-icon" style={{ display: 'flex' }}>
                    <Button
                        type="primary"
                        onClick={() => {
                            if (Helper.getInstance().hasPermission('RISK.CATEGORY.EDIT')) {
                                ref.current.open(id)
                            }
                        }}
                        className="circle-icon-edit"
                        shape="circle"
                        style={{ marginRight: 15 }}
                        icon={<EditOutlined />}
                    />
                    <ConfirmDelete
                        record={record}
                        deleting={deleting}
                        permission={{
                            restrict: true,
                            noPermission: Helper.getInstance().isRetricAccess('RISK.CATEGORY.DELETE')
                        }}
                        onConfirm={() => deleteById(id)}
                    />
                </div>
            }
        },
    ];

    const onAddNew = () => {
        if (Helper.getInstance().hasPermission('RISK.CATEGORY.CREATE')) {
            ref.current.open();
        }
    }

    const showTotal: PaginationProps['showTotal'] = (total, range) => `${range[0]}-${range[1]} of ${total} items`;

    return (
        <Row gutter={[16, 16]}>
            <Col sm={24} md={6} xl={6}>
                <PageTitle title='Risk Category' />
            </Col>

            <Col sm={24} md={18} xl={18} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Input placeholder="Search..." style={{ width: 200, marginRight: 15 }} prefix={<SearchOutlined />} allowClear onChange={onSearch} />
                <Button type="primary" icon={<PlusOutlined />} onClick={onAddNew}>
                    Add New
                </Button>
                <CategoryForm reload={fetchCategory} ref={ref} />
            </Col>

            <Col sm={24} md={24} xl={24}>
                <Table
                    loading={loading}
                    columns={columns}
                    dataSource={categories?.data}
                    onChange={(pagination, filters, sorter: any) => {
                        if (sorter.order) {
                            fetchCategory({ sortColumn: sorter.field, sortType: sorter.order });
                        }

                        setSort({ sortColumn: sorter.field, sortType: sorter.order });
                    }}
                    pagination={false}
                    footer={() => (
                        <Pagination
                            defaultCurrent={1}
                            pageSize={categories.per_page}
                            total={categories.total}
                            showTotal={showTotal}
                            onChange={onChangePageSize}
                        />
                    )}
                />
            </Col>
        </Row>
    );
};
export default Page;


