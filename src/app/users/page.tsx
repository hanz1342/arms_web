'use client'
import React, { useState } from "react";
import Swal from "sweetalert2";
import {
  Button,
  Table,
  Select,
  Drawer,
  Form,
  Pagination,
  PaginationProps,
  PageTitle,
  Row,
  Col,
  Input,
  Tag,
  NoPermission
} from '@/components';
import {
  CloseOutlined,
  EditOutlined,
  FilterOutlined,
  PlusOutlined,
  SearchOutlined,
  UnlockOutlined
} from '@icons';
import type { ColumnsType } from 'antd/es/table';
import './style.css';
import EmployeeForm from "./form";
import { getEmployees, resetPassword } from "@/services";
import { PaginateResponse } from "@/responses";
import { useRouter, useSearchParams } from "@/router";
import Helper from "@/helper";
import { EmployeeFilter } from "@/types/employee";
import { useEmployeeOptions } from "@/hooks";
import { Sort } from "@/types/sort";

interface DataType {
  key: React.Key;
  action: string;
  employee_id: string;
  first_name: string;
  last_name: string;
  directorate: string;
  department: string;
  division: string;
  email_address: string;
  user_type: string;
  employee_status: string;
}

export default function Page() {
  if (Helper.getInstance().isRetricAccess('EMPLOYEE.VIEW')) {
    return <NoPermission />;
  }
  
  const [sort, setSort] = React.useState<Sort>();
  const [visibleDrawer, setVisibleDrawer] = React.useState(false);
  const [visibleResetPassword, setVisibleResetPassword] = React.useState(false);
  const [employeeResetPassword, setEmployeeResetPassword] = React.useState<any>(null);
  const [employees, setEmployees] = useState<PaginateResponse>(new PaginateResponse());

  const ref = React.useRef({ open: (id?: number) => {} });
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formDrawer] = Form.useForm()
  const [formResetPassword] = Form.useForm()
  const { options } = useEmployeeOptions();
  let timer: any = null;

  React.useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = (option?: EmployeeFilter) => {
    getEmployees(option)
    .then((response: any) => {
      if (response?.data) {
        setEmployees(response?.data);
      }
    });
  }

  const onShowDrawer = () => {
    setVisibleDrawer(true);
  }

  const onHideDrawer = () => {
    setVisibleDrawer(false);
  }

  const onFinish = (values: any) => {
    const directorate = values.directorate ?? '';
    const department = values.department ?? '';
    const division = values.division ?? '';

    let queryParams = `&directorate=${directorate}`
    queryParams += `&department=${department}`
    queryParams += `&division=${division}`

    router.push(`?${queryParams}`)
    onHideDrawer()

    const option = {
        department,
        division,
        directorate
    };

    fetchEmployees(option);
  };

  const onResetPassword = (values: any) => {
    resetPassword({
      password: values.password,
      userId: employeeResetPassword?.user_id
    })
    .then(() => {
      Swal.fire({
        icon: "success",
        title: "Password Reset Successful",
        text: "Your password has been successfully reset.",
        showConfirmButton: false,
        timer: 1500
      })
      .then(() => {
        setVisibleResetPassword(false);
      });      
    })
  }

  const onResetFilter = () => {
    router.push('?');
    fetchEmployees();
    formDrawer.resetFields();
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'Action',
      dataIndex: 'EmployeeID',
      render: (EmployeeID: number, record: any) => {
        return <div style={{ display: 'flex' }}>
          <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={() => {
            if (Helper.getInstance().hasPermission('EMPLOYEE.UPDATE')) {
              ref.current.open(EmployeeID)
            }
          }} />
          <Button danger style={{ marginLeft: 15 }} type="primary" shape="circle" icon={<UnlockOutlined />} onClick={() => {
            if (Helper.getInstance().hasPermission('EMPLOYEE.RESET.PASSWORD')) {
              setVisibleResetPassword(true)
              setEmployeeResetPassword(record);
            }
          }} />
        </div>
      }
    },
    {
      title: 'First Name',
      dataIndex: 'Firstname',
      sorter: true,
      defaultSortOrder: 'ascend'
    },
    {
      title: 'Last Name',
      dataIndex: 'Lastname',
      sorter: true,
    },
    {
      title: 'Directorate',
      dataIndex: 'Directorate',
      sorter: true
    },
    {
      title: 'Department',
      dataIndex: 'Department',
      sorter: true
    },
    {
      title: 'Division',
      dataIndex: 'Division',
      sorter: true
    },
    {
      title: 'Email Address',
      dataIndex: 'EmailID',
      sorter: true
    },
    {
      title: 'Roles',
      dataIndex: 'roles',
      sorter: true,
      render: (roles: any) => {
        try {
          roles = JSON.parse(roles);
          return roles.map((userType: string, index: number) => <Tag key={index} style={{ marginRight: 5, marginBottom: 5 }}>{userType}</Tag>);
        } catch (e) {
          return '';
        }
      }
    },
    {
      title: 'Status',
      dataIndex: 'Active',
      sorter: (a: any, b: any) => a.Active - b.Active,
      render: (status: any) => {
        if (status === 1) return <Tag color="#87d068" style={{ minWidth: 70, textAlign: "center" }}>Active</Tag>;
        if (status === 0) return <Tag style={{ minWidth: 70, textAlign: "center" }}>Inactive</Tag>;
      }
    },
  ];

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
    
    fetchEmployees({ ...option, pageSize });

    router.push(`?${queryParams}`);
  }

  /**
   * 
   * @param status 
   */
  const onChangeStatus = (status: string) => {
    const { queryParams, option } = Helper.getInstance().appendFilterParams(searchParams, 'status', status);

    router.push(`?${queryParams}`);

    fetchEmployees(option);
  };

  const onChangeUserType = (roleId: string) => {
    const { queryParams, option } = Helper.getInstance().appendFilterParams(searchParams, 'roleId', roleId);

    router.push(`?${queryParams}`);

    fetchEmployees(option);
  };

  /**
   * On search
   * @param event 
   */
  const onSearch = (event: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
        router.push('?');
        formDrawer.resetFields();

        const search = event.target.value;
        const { option, queryParams } = Helper.getInstance().appendFilterParams(searchParams, 'search', search);

        router.push(`?${queryParams}`);
        fetchEmployees(option);
    }, 1200);
  };

  const showTotal: PaginationProps['showTotal'] = (total, range) => `${range[0]}-${range[1]} of ${total} items`;

  const currentFilters = Helper.getInstance().getCurrentFilters(searchParams);

  return <Row gutter={[16, 16]}>
    <Col sm={24} md={6} xl={6}>
        <PageTitle title='System Users' />
    </Col>
    <Col sm={24} md={18} xl={18} style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Input placeholder="Search..." style={{ width: 200 }} prefix={<SearchOutlined />} allowClear onChange={onSearch} />
      <Select
        placeholder="Select status"
        onChange={onChangeStatus}
        options={[
          { value: 1, label: 'Active' },
          { value: 0, label: 'Inactive' }
        ]}
        style={{ marginLeft: 15, minWidth: 150 }}
        allowClear
      />
      <Select
        placeholder="Select user type"
        onChange={onChangeUserType}
        options={options?.userTypes ?? []}
        style={{ marginLeft: 15, minWidth: 150 }}
        allowClear
      />

      <Button icon={<FilterOutlined />} style={{ marginLeft: 10 }} onClick={onShowDrawer}>
          More Filter
      </Button>

      <Button icon={<CloseOutlined />} style={{ marginLeft: 10, marginRight: 10 }} onClick={onResetFilter}>
          Reset Filter {Object.keys(currentFilters).length > 0 ? `(${Object.keys(currentFilters).length})` : ''}
      </Button>
      
      <Button type="primary" icon={<PlusOutlined />} onClick={() => {
        if (Helper.getInstance().hasPermission('EMPLOYEE.CREATE')) {
          ref.current.open()
        }
      }}>
          Add New
      </Button>

      <Drawer title="Reset Password" placement="right" onClose={() => {
        setVisibleResetPassword(false)
        setEmployeeResetPassword(null)
      }} open={visibleResetPassword}>
        <Form
          form={formResetPassword}
          layout="vertical"
          autoComplete="off"
          onFinish={onResetPassword}
        >
          <Form.Item
            name="password"
            label="New Password"
            rules={[{ required: true, message: 'Please enter new password' }]}
          >
            <Input.Password placeholder='Please enter new password'/>
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject('The two passwords do not match.');
                },
              }),
              { required: true, message: 'Please enter confirm password' }
            ]}
          >
            <Input.Password placeholder='Please enter confirm password'/>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              // loading={loading}
              // disabled={loading}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Drawer>

      <EmployeeForm reload={fetchEmployees} ref={ref} />

      <Drawer title="More Filter" placement="right" onClose={onHideDrawer} open={visibleDrawer}>
        <Form
            form={formDrawer}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
        >
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
    </Col>
    <Col sm={24} md={24} xl={24}>
      <Table
        columns={columns}
        dataSource={employees?.data ?? []}
        onChange={(pagination, filters, sorter: any) => {
          if (sorter.order) {
            fetchEmployees({ sortColumn: sorter.field, sortType: sorter.order });
          } else {
            fetchEmployees();
          }
          
          setSort({ sortColumn: sorter.field, sortType: sorter.order });
      }}
        pagination={false}
        footer={() => (
          <Pagination
              defaultCurrent={1}
              pageSize={employees.per_page}
              total={employees.total}
              showTotal={showTotal}
              onChange={onChangePageSize}
          />
        )}
      />
    </Col>
  </Row>
}
