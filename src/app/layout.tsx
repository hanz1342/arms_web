'use client';
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { getCookie } from 'cookies-next';
import { Rubik } from 'next/font/google';
import NextTopLoader from "nextjs-toploader";
import Swal from "sweetalert2";
import type { MenuProps, ThemeConfig } from 'antd';
import { 
  Layout,
  Menu,
  theme,
  Dropdown,
  Space,
  ConfigProvider,
  Drawer,
  Form,
  Input,
  Button
} from '@/components';
import './globals.css'
import StyledComponentsRegistry from '../../lib/AntdRegistry';
import { 
  BarChartOutlined, 
  DashboardOutlined, 
  UserOutlined, 
  LogoutOutlined, 
  SettingOutlined, 
  DiffOutlined, 
  BugOutlined, 
  SnippetsOutlined, 
  StockOutlined,
  MenuFoldOutlined,
  CloseOutlined,
  UndoOutlined
} from '@icons';
import { usePathname, useRouter } from '@/router'
import { QueryClient, QueryClientProvider, } from '@tanstack/react-query';
import { ChangePasswordInterface } from '@/types';
import { changePassword } from '@/services';
import { FontSizeContext } from '@/contexts/FontSizeOption';

const { Header, Content, Sider } = Layout;
type MenuItem = Required<MenuProps>['items'][number];
const rubik = Rubik({ subsets: ["latin"] });
function getItem(label: React.ReactNode, path?: string, key?: React.Key, icon?: React.ReactNode, children?: MenuItem[],): MenuItem {
  return {
    key,
    icon,
    children,
    path,
    label: path ? <Link href={path}>{label}</Link> : label,
  } as MenuItem;
};

const items: MenuItem[] = [
  getItem('Dashboard', '/', 0, <DashboardOutlined />),
  getItem('Risk Matrix', '/riskmatrix', 1, <BarChartOutlined />),
  getItem('Risk Details', '/risk_details', 2, <SnippetsOutlined />),
  getItem('Risk Management', '', 3, <BugOutlined />, [
    getItem('All Risks', '/risks', 31),
    getItem('New Risk', '/risks/create', 32),
    getItem('Update Risk', '/risks/edit/1', 33),
  ]),
  getItem('Risk Aggregation', '', 4, <StockOutlined />, [
    getItem('Directorates', '/ra_directorates', 41),
    getItem('Departments', '/ra_departments', 42),
    getItem('ASEC Wides', '/ra_asec_wides', 43),
  ]),
  getItem('Cancelled Risks', '/cancelled_risks', 5, <UndoOutlined />),
  getItem('Risk Category', '/risk_category', 6, <DiffOutlined />),
  getItem('System Users', '/users', 7, <UserOutlined />),
  getItem('Setting', '', 8, <SettingOutlined />, [
    getItem('Impact Categories', '/impact_categories', 71),
    getItem('Department', '/departments', 72),
    getItem('Division', '/divisions', 73),
    getItem('Directorate', '/directorates', 73),
    getItem('Quarter', '/quarters', 74),
    getItem('Roles', '/roles', 75),
  ])
];

// Create a client
const queryClient = new QueryClient()

export default function RootLayout({ children, }: { children: React.ReactNode }) {
  let profile: any = getCookie('profile');
  profile = profile ? JSON.parse(profile) : {};

  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [openDrawerChangePass, setOpenDrawerChangePass] = React.useState(false);
  const [fontSize, setFontSize] = React.useState(14);
  const { token: { colorBgContainer }, } = theme.useToken();
  const router = useRouter();

  const pathName = usePathname();
  const isAuthPage = ["/auth", "/logout"].includes(pathName);

  const activeMenuAt = items.findIndex((item: any) => item?.path === pathName);
  
  const showDrawerChangePass = () => {
    setOpenDrawerChangePass(true);
  };

  const onCloseDrawerChangePass = () => {
    setOpenDrawerChangePass(false);
  };

  const menuItems: MenuProps['items'] = [
    {
      label: 'Change Password',
      key: '1',
      icon: <UserOutlined />,
      onClick: showDrawerChangePass
    },
    {
      label: 'Logout',
      key: '2',
      icon: <LogoutOutlined />,
      onClick: () => router.replace('/logout')
    }
  ];

  const config: ThemeConfig = {
    token: {
      fontSize,
      colorPrimary: '#0060A9',
      fontFamily: '__Rubik_5c20f6',
      colorText: '#858796',
    },
    components: {
      Form: {
        marginLG: 15
      },
      Menu: {
        itemBorderRadius: 0,
        itemMarginInline: 0
      }
    }
  };

  const onFinish = async (values: ChangePasswordInterface) => {
    setLoading(true);
    changePassword({
      password: values.password,
      userId: profile.user_id
    })
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Password Changed",
          text: 'Your password has been changed successfully!',
          showConfirmButton: false,
          timer: 1500
        })
        .then(() => {
          form.validateFields();
          onCloseDrawerChangePass();
        });
      })
      .finally(() => {
        setLoading(false);
      })
  };

  const offNavigat = () => {
    var ar_layout_sider = document.getElementsByClassName("ar-layout-sider");
    var ar_layout_sider_trigger = document.getElementsByClassName("ar-layout-sider-trigger");

    // Loop through the elements and set their styles
    for (var i = 0; i < ar_layout_sider.length; i++) {
      ar_layout_sider[i].classList.add("offNavigatClass");
      ar_layout_sider_trigger[i].classList.add("offTrigger");
    }
  }

  const closeOffNavigat = () => {
    var ar_layout_sider = document.getElementsByClassName("ar-layout-sider");
    var ar_layout_sider_trigger = document.getElementsByClassName("ar-layout-sider-trigger");

    // Loop through the elements and remove the class
    for (var i = 0; i < ar_layout_sider.length; i++) {
        ar_layout_sider[i].classList.remove("offNavigatClass");
        ar_layout_sider_trigger[i].classList.remove("offTrigger");
    }
  }

  return (
    <html lang="en">
      <Head>ASEC Risk Management</Head>
      <body className={rubik.className} style={{ margin: 0, /*overflow: 'hidden'*/ }}>
        <StyledComponentsRegistry>
          <ConfigProvider theme={config} prefixCls="ar" iconPrefixCls="aricon">
            <QueryClientProvider client={queryClient}>
              <FontSizeContext.Provider value={{ fontSize, onChangeFontSize: setFontSize }}>
                <Layout style={{ minHeight: '100vh' }}>
                  {isAuthPage ? (
                    <></>
                  ) : (
                    <Sider collapsible collapsed={false} style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0, width: '200px !important' }} onCollapse={(value) => console.log('hello world')}>
                      <CloseOutlined onClick={() => closeOffNavigat()}/>
                      <div className="demo-logo-vertical" />
                      <Menu theme="dark" defaultSelectedKeys={[`${0}`]} selectedKeys={[`${activeMenuAt}`]} mode="inline" items={items} />
                    </Sider>
                  )}

                  <Layout style={{ marginLeft: isAuthPage ? 0 : 200 }}>
                    {isAuthPage ? (
                      <></>
                    ) : (
                      <Header className='header-bar' style={{ padding: 0, background: colorBgContainer}}>
                        <div className="icon-menu-side">
                          <MenuFoldOutlined onClick={() => offNavigat()}/>     
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row', marginRight: 25 }}>
                          <Button disabled={fontSize <= 14} onClick={() => setFontSize(fontSize - 1)} style={{ fontSize: 14 }}>-A</Button>
                          <Button onClick={() => setFontSize(fontSize + 1)} style={{ fontSize: 14, marginLeft: 15 }}>+A</Button>
                        </div>
                        <div className='profile'>
                          <Dropdown menu={{ items: menuItems }} trigger={['click', 'hover']}>
                            <a onClick={(e) => e.preventDefault()}>
                              <Space>
                                {profile ? profile.EmployeeName : 'Unknown'}
                                <div className='icon-profile'>
                                  <img src='https://ps.w.org/user-avatar-reloaded/assets/icon-128x128.png?rev=2540745' alt='profile' />
                                </div>
                              </Space>
                            </a>
                          </Dropdown>
                        </div>
                        <Drawer title="Change Password" placement="right" onClose={onCloseDrawerChangePass} open={openDrawerChangePass}>
                          <Form
                            form={form}
                            layout="vertical"
                            autoComplete="off"
                            onFinish={onFinish}
                          >
                            <Form.Item
                              name="password"
                              label="New Password"
                              rules={[{required: true, message: 'Please enter new password!'}]}
                            >
                              <Input.Password placeholder='Enter new password'/>
                            </Form.Item>
                            <Form.Item
                              name="userId"
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
                                {
                                  required: true, message: 'Please enter confirm password!'
                                }
                              ]}
                            >
                              <Input.Password placeholder='Enter confirm password'/>
                            </Form.Item>
                            <Form.Item>
                              <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                disabled={loading}
                              >
                                Submit
                              </Button>
                            </Form.Item>
                          </Form>
                        </Drawer>
                      </Header>
                    )}

                    <Content style={{ padding: isAuthPage ? '0px' : '16px 16px', /*overflowY: 'scroll'*/ }}>
                      <NextTopLoader color="#0060A9" />
                      {children}
                    </Content>
                    {/* <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer> */}
                  </Layout>
                </Layout>
              </FontSizeContext.Provider>
            </QueryClientProvider>
          </ConfigProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
};