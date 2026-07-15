'use client';
import React, { useState } from "react";
import Swal from "sweetalert2";
import {
    Table,
    Button,
    Input,
    Col,
    ConfirmDelete,
    Row,
    PageTitle,
    Pagination,
    PaginationProps,
    Modal,
    NoPermission,
    Tag
} from '@/components';
import { EditOutlined, PlusOutlined, SearchOutlined } from '@icons';
import type { ColumnsType } from 'antd/es/table';
import { RoleFilter, RoleInterface, } from "@/types";
import { getRoles, deleteRoleById } from "@/services";
import { PaginateResponse } from "@/responses";
import Helper from "@/helper";
import { useRouter, useSearchParams } from "@/router";
import { Sort } from "@/types/sort";

const Page = () => {
    if (Helper.getInstance().isRetricAccess('ROLE.VIEW')) {
        return <NoPermission />;
    }

    const [sort, setSort] = React.useState<Sort>();
    const [loading, setLoading] = useState<boolean>(true);
    const [open, setOpen] = useState<boolean>(false);
    const [deleteId, setDeleteId] = useState<number>(0);
    const [deleting, setDeleting] = useState<boolean>(false);
    const [roles, setRoles] = React.useState<PaginateResponse>(new PaginateResponse());
    const router = useRouter();
    const searchParams = useSearchParams();
    let timer: any = null;

    React.useEffect(() => {
        fetchRoles()
    }, []);

    const fetchRoles = (option?: RoleFilter) => {
        getRoles(option)
            .then((response: any) => {
                if (response?.data) {
                    setRoles(response?.data);
                }
            })
            .catch((error: any) => {
                console.log(error);
            })
            .finally(() => {
                setLoading(false);
            })
    };

    const onDelete = (id: number) => {
        setDeleting(true);
        deleteRoleById(id)
        .then(() => {

        })
        .finally(() => {
            setDeleting(false);
            setOpen(false);
            fetchRoles();
        });
    };

    const onSearch = (event: any) => {
        const search = event.target.value;
        const { option, queryParams } = Helper.getInstance().appendFilterParams(searchParams, 'search', search);
    
        clearTimeout(timer);
        timer = setTimeout(() => {
            router.push(`?${queryParams}`);
            fetchRoles(option);
        }, 1200);
    };

    const deleteById = (id: number) => {
        setDeleting(true)
        deleteRoleById(id)
        .then((response: any) => {
            if (response?.error === 'RECORD.LINKED') {
                const users = response.users;
                Swal.fire({
                    icon: "error",
                    title: `This role linked to these users ${users.map((user: any) => user.EmailID).join(',')}`,
                    showConfirmButton: false
                })
                .then(() => {
                    fetchRoles();
                });
            } else {
                Swal.fire({
                    icon: "success",
                    title: "You've deleted",
                    showConfirmButton: false,
                    timer: 1500
                })
                .then(() => {
                    fetchRoles();
                });
            }
        })
        .finally(() => {
            setDeleting(false);
        });
    }
    
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

        fetchRoles({ ...option, pageSize }); 
    }

    const columns: ColumnsType<RoleInterface> = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: "name",
            sorter: true,
            defaultSortOrder: 'ascend'
        },
        {
            title: 'Redirect To',
            dataIndex: 'redirect_to',
            key: "redirect_to",
            sorter: true
        },
        {
            title: 'Order',
            dataIndex: 'sort',
            key: "sort",
            sorter: true
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            sorter: true,
            render: (status: any) => {
                if (status === 'active') return <Tag color="#87d068" style={{ minWidth: 70, textAlign: "center" }}>Active</Tag>;
                if (status === 'deactive') return <Tag style={{ minWidth: 70, textAlign: "center" }}>Inactive</Tag>;
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
                        className="circle-icon-edit"
                        shape="circle"
                        icon={<EditOutlined />}
                        style={{ marginRight: 15 }}
                        onClick={() => {
                            if (Helper.getInstance().hasPermission('ROLE.UPDATE')) {
                                router.push(`/roles/edit/${id}`)
                            }
                        }}
                    />
                    <ConfirmDelete
                        record={record}
                        deleting={deleting}
                        permission={{
                            restrict: true,
                            noPermission: Helper.getInstance().isRetricAccess('ROLE.DELETE')
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
                    <PageTitle title='Roles' />
                </Col>

                <Modal
                    title="Are you sure?"
                    open={open}
                    onOk={() => onDelete(deleteId)}
                    onCancel={() => setOpen(false)}
                    okText="Yes, delete it!"
                    okButtonProps={{ danger: true, loading: deleting }}
                    cancelText="Cancel"
                >
                    <p>You won't be able to revert this!</p>
                </Modal>

                <Col sm={24} md={18} xl={18} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Input
                        placeholder="Search..."
                        style={{ width: 200, marginRight: 15 }}
                        prefix={<SearchOutlined />}
                        allowClear
                        onChange={onSearch}
                    />
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => {
                        if (Helper.getInstance().hasPermission('ROLE.CREATE')) {
                            router.push('/roles/create')
                        }
                    }}>
                        Add New
                    </Button>
                </Col>

                <Col sm={24} md={24} xl={24}>
                    <Table
                        loading={loading}
                        columns={columns}
                        dataSource={roles?.data ?? []}
                        onChange={(pagination, filters, sorter: any) => {
                            if (sorter.order) {
                                fetchRoles({ sortColumn: sorter.field, sortType: sorter.order });
                            }

                            setSort({ sortColumn: sorter.field, sortType: sorter.order });
                        }}
                        pagination={false}
                        footer={() => (
                            <Pagination
                                defaultCurrent={1}
                                pageSize={roles.per_page}
                                total={roles.total}
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
