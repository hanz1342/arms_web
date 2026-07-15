'use client';
import React, { useState } from "react";
import Swal from "sweetalert2";
import { Table, Button, Input, Col, Row, PageTitle, Pagination, PaginationProps, ConfirmDelete, Tag, NoPermission } from '@/components';
import { EditOutlined, PlusOutlined, SearchOutlined } from '@icons';
import type { ColumnsType } from 'antd/es/table';
import { DepartmentFilter, DepartmentInterface, } from "@/types";
import { getDepartment, deleteDepartmentById } from "@/services";
import DepartmentForm from "./form";
import { PaginateResponse } from "@/responses";
import Helper from "@/helper";
import { useRouter, useSearchParams } from "@/router";
import { Sort } from "@/types/sort";

const Page = () => {
    if (Helper.getInstance().isRetricAccess('DEPARTMENT.VIEW')) {
        return <NoPermission />;
    }
    
    const [sort, setSort] = React.useState<Sort>();
    const [loading, setLoading] = useState<boolean>(true);
    const [deleting, setDeleting] = useState<boolean>(false);
    const [departments, setDepartments] = React.useState<PaginateResponse>(new PaginateResponse());
    const ref = React.useRef({open: (id?: number) => {} });
    const router = useRouter();
    const searchParams = useSearchParams();
    let timer: any = null;

    React.useEffect(() => {
        fetchDepartments()
    }, []);

    const fetchDepartments = (option?: DepartmentFilter) => {
        getDepartment(option)
            .then((response: any) => {
                if (response?.data) {
                    setDepartments(response?.data);
                }
            })
            .catch((error: any) => {
                console.log(error);
            })
            .finally(() => {
                setLoading(false);
            })
    }

    const deleteById = (id: number) => {
        setDeleting(true)
        deleteDepartmentById(id)
        .then((response: any) => {
            if (response?.error === 'RECORD.LINKED') {
                Swal.fire({
                    icon: "error",
                    title: "This department linked to other risk",
                    showConfirmButton: false,
                    timer: 1500
                })
                .then(() => {
                    fetchDepartments();
                });
            } else {
                Swal.fire({
                    icon: "success",
                    title: "You've deleted",
                    showConfirmButton: false,
                    timer: 1500
                })
                .then(() => {
                    fetchDepartments();
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
            fetchDepartments(option);
        }, 1200);
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

        fetchDepartments({ ...option, pageSize }); 
    }

    const columns: ColumnsType<DepartmentInterface> = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: "name",
            sorter: true,
            defaultSortOrder: 'ascend'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            sorter: true,
            render: (status: any) => {
                if (status === 1) return <Tag color="#87d068" style={{ minWidth: 70, textAlign: "center" }}>Active</Tag>;
                if (status === 0) return <Tag style={{ minWidth: 70, textAlign: "center" }}>Inactive</Tag>;
            }
        },
        {
            title: 'Action',
            key: 'id',
            dataIndex: 'id',
            render: (id: number, record: any) => (
                <div className="render-icon">
                    <Button
                        type="primary"
                        onClick={() => ref.current?.open(id)}
                        className="circle-icon-edit"
                        shape="circle"
                        icon={<EditOutlined />}
                        style={{ marginRight: 15 }}
                    />
                    <ConfirmDelete
                        record={record}
                        deleting={deleting}
                        permission={{
                            restrict: true,
                            noPermission: Helper.getInstance().isRetricAccess('DEPARTMENT.DELETE')
                        }}
                        onConfirm={() => deleteById(id)}
                    />
                </div>
            )
        },
    ];

    const showTotal: PaginationProps['showTotal'] = (total, range) => `${range[0]}-${range[1]} of ${total} items`;

    return (
        <>
            <Row gutter={[16, 16]}>
                <Col sm={24} md={6} xl={6}>
                    <PageTitle title='Departments' />
                </Col>

                <Col sm={24} md={18} xl={18} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Input
                        placeholder="Search..."
                        style={{ width: 200, marginRight: 15 }}
                        prefix={<SearchOutlined />}
                        allowClear
                        onChange={onSearch}
                    />
                    {
                        Helper.getInstance().hasPermission('DEPARTMENT.CREATE') && 
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => ref.current?.open()}>
                            Add New
                        </Button>
                    }
                    <DepartmentForm reload={fetchDepartments} ref={ref} />
                </Col>

                <Col sm={24} md={24} xl={24}>
                    <Table
                        loading={loading}
                        columns={columns}
                        dataSource={departments?.data ?? []}
                        onChange={(pagination, filters, sorter: any) => {
                            if (sorter.order) {
                                fetchDepartments({ sortColumn: sorter.field, sortType: sorter.order });
                            }

                            setSort({ sortColumn: sorter.field, sortType: sorter.order });
                        }}
                        pagination={false}
                        footer={() => (
                            <Pagination
                                defaultCurrent={1}
                                pageSize={departments.per_page}
                                total={departments.total}
                                showTotal={showTotal}
                                onChange={onChangePageSize}
                            />
                        )}
                    />
                </Col>
            </Row>
        </>
    );
};
export default Page;
