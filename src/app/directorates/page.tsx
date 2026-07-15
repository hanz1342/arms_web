'use client'
import React, { useState } from "react";
import Swal from "sweetalert2";
import {
  Button,
  Table,
  Input,
  Pagination,
  PaginationProps,
  Row,
  Col,
  PageTitle,
  NoPermission,
  Tag,
  ConfirmDelete
} from '@/components';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined
} from '@icons';
import type { ColumnsType } from 'antd/es/table';
import { getDirectorates, deleteDirectorateById } from "@/services";
import DirectorateForm from "./form";
import './style.css';
import Helper from "@/helper";
import { DirectorateFilter } from "@/types/directorate";
import { useRouter, useSearchParams } from "@/router";
import { PaginateResponse } from "@/responses";
import { Sort } from "@/types/sort";

interface DataType {
  key: React.Key;
  name: string;
  status: number;
}

export default function Page() {
  if (Helper.getInstance().isRetricAccess('DIRECTORATE.VIEW')) {
    return <NoPermission />;
  }

  const [sort, setSort] = React.useState<Sort>();
  const [loading, setLoading] = useState<boolean>(true);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [directorates, setDirectorates] = React.useState<PaginateResponse>(new PaginateResponse());
  const ref = React.useRef({open: (id?: number) => {} });
  const router = useRouter();
  const searchParams = useSearchParams();
  let timer: any = null;

  React.useEffect(() => {
    fetchData()
  }, []);

  const fetchData = (option?: DirectorateFilter) => {
    getDirectorates(option)
        .then((response: any) => {
            if (response?.data) {
              setDirectorates(response?.data);
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
    deleteDirectorateById(id)
    .then((response: any) => {
        if (response?.error === 'RECORD.LINKED') {
            Swal.fire({
                icon: "error",
                title: "This directorate linked to other risk",
                showConfirmButton: false,
                timer: 1500
            })
            .then(() => {
              fetchData();
            });
        } else {
            Swal.fire({
                icon: "success",
                title: "You've deleted",
                showConfirmButton: false,
                timer: 1500
            })
            .then(() => {
              fetchData();
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
        fetchData(option);
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

    fetchData({ ...option, pageSize });
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'Name',
      dataIndex: 'name',
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
                  onClick={() => {
                    if (Helper.getInstance().hasPermission('DIRECTORATE.UPDATE')) {
                      ref.current?.open(id)
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
                      noPermission: Helper.getInstance().isRetricAccess('DIRECTORATE.DELETE')
                  }}
                  onConfirm={() => deleteById(id)}
              />
          </div>
      )
    },
  ];

  const showTotal: PaginationProps['showTotal'] = (total, range) => `${range[0]}-${range[1]} of ${total} items`;

  return (<Row gutter={[16, 16]}>
      <Col sm={24} md={6} xl={6}>
        <PageTitle title='Directorates' />
      </Col>

      <Col sm={24} md={18} xl={18} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Input placeholder="Search..." style={{ width: 200, marginRight: 15 }} prefix={<SearchOutlined />} allowClear onChange={onSearch} />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => {
            if (Helper.getInstance().hasPermission('DIRECTORATE.CREATE')) {
              ref.current.open()
            }
          }}>
              Add New
          </Button>
          <DirectorateForm reload={fetchData} ref={ref} />
      </Col>

      <Col sm={24} md={24} xl={24}>
        <Table
          loading={loading}
          columns={columns}
          dataSource={directorates?.data ?? []}
          onChange={(pagination, filters, sorter: any) => {
            if (sorter.order) {
              fetchData({ sortColumn: sorter.field, sortType: sorter.order });
            }

            setSort({ sortColumn: sorter.field, sortType: sorter.order });
          }}
          pagination={false}
          footer={() => (
            <Pagination
                defaultCurrent={1}
                pageSize={directorates.per_page}
                total={directorates.total}
                showTotal={showTotal}
                onChange={onChangePageSize}
            />
          )}
        />
      </Col>
  </Row>)
}
