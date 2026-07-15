'use client';
import React from 'react';
import Swal from 'sweetalert2';
import {
   Button,
   Col,
   Form,
   Input,
   PageTitle,
   Row,
   Select,
   Checkbox
} from '@/components';
import {
   getRoleSelectOptions,
   createRole,
   getRoleById,
   updateRoleById
} from '@/services';
import { ArrowLeftOutlined } from '@/components/icons';
import { useRouter } from '@/router';

interface RoleFormProps {
   title: string;
   id?: number;
   reload: () => void;
};

const RoleForm = React.forwardRef((props: RoleFormProps, ref: any) => {
   const id = props.id;
   const [state, setState] = React.useState<any>({
      redirectablePages: [],
      privilegeModules: [],
      departments: [],
      directorates: [],
      divisions: [],
   });
   const [submitting, setSubmitting] = React.useState<boolean>(false);
   const [grantedPrivileges, setGrantedPrivileges] = React.useState<any>([]);
   const [form] = Form.useForm();
   const router = useRouter();

   React.useEffect(() => {
      getRoleSelectOptions()
      .then((response: any) => {
         if (response?.data) {
            setState(response.data);
         }
      });

      if (id) {
         getRoleById(id)
            .then((response: any) => {
               if (response) {
                  let departments: any[] = [];
                  let directorates: any[] = [];
                  let divisions: any[] = [];

                  if (response?.accessable_metadata) {
                     const accessableMetadata = JSON.parse(response.accessable_metadata);
                     
                     if (accessableMetadata?.departments) {
                        departments = accessableMetadata?.departments;
                     }

                     if (accessableMetadata?.directorates) {
                        directorates = accessableMetadata?.directorates;
                     }

                     if (accessableMetadata?.divisions) {
                        directorates = accessableMetadata?.divisions;
                     }
                  }

                  form.setFieldsValue({
                     ...response,
                     departments,
                     directorates,
                     divisions
                  });

                  if (response.scopes && Array.isArray(JSON.parse(response.scopes))) {
                     const scopes = JSON.parse(response.scopes);
                     setGrantedPrivileges(scopes.map((scope: string) => {
                        const scopeArrs = scope.split('.');
                        return {
                           module: scopeArrs[0].toLowerCase(),
                           value: scope
                        };
                     }));
                  }
               }
            })
            .catch(error => console.log('error:', error));
      }
   }, [id]);


   const onFinish = async (values: any) => {
      if (grantedPrivileges.length > 0) {
         values.scopes = JSON.stringify(grantedPrivileges.map((grantedPrivilege: any) => grantedPrivilege.value));
      }
   
      setSubmitting(true);
      if (id) {
         values.accessable_metadata = {};
         if (values?.departments?.length > 0) {
            values.accessable_metadata = {
               departments: values.departments
            };
         }

         if (values?.directorates?.length > 0) {
            values.accessable_metadata = {
               directorates: values.directorates
            };
         }

         if (values?.divisions?.length > 0) {
            values.accessable_metadata = {
               divisions: values.divisions
            };
         }
         
         updateRoleById(values, id)
         .then(() => {
            props.reload();
            Swal.fire({
               icon: "success",
               title: "Your role has been updated",
               showConfirmButton: false,
               timer: 1500
            });
         })
         .finally(() => {
            setSubmitting(false);
            form.validateFields();
         })
      } else {
         values.accessable_metadata = {};
         if (values?.departments?.length > 0) {
            values.accessable_metadata = {
               departments: values.departments
            };
         }

         if (values?.directorates?.length > 0) {
            values.accessable_metadata = {
               directorates: values.directorates
            };
         }

         if (values?.divisions?.length > 0) {
            values.accessable_metadata = {
               divisions: values.divisions
            };
         }

         createRole(values)
         .then(() => {
            props.reload();
            Swal.fire({
               icon: "success",
               title: "Your role has been created",
               showConfirmButton: false,
               timer: 1500
               });
         })
         .finally(() => {
            setSubmitting(false);
         })
      }


   };

   const onSubmit = async () => {
      const values = await form.validateFields();
      onFinish(values);
   }

   const onGrantAll = (event: any, module: string) => {
      const foundPrivilegeModule = state.privilegeModules.filter((privilegeModule: any) => privilegeModule.key === module);

      if (event.target.checked) {
         setGrantedPrivileges((prevState: any) => {
            const mappedGrantedPrivileges: any = [];

            foundPrivilegeModule.forEach((privilegeModule: any) => {
               privilegeModule.privileges = privilegeModule.privileges.map((privilege: any) => {
                  privilege.module = module;
                  return privilege;
               });
               mappedGrantedPrivileges.push(...privilegeModule.privileges);
            });

            return prevState.concat(mappedGrantedPrivileges);
         });
      } else {
         setGrantedPrivileges((prevState: any) => prevState.filter((grantedPrivilege: any) => grantedPrivilege.module !== module));
      }
   }

   const onGrant = (event: any, module: string, privilege: any) => {
      if (event.target.checked) {
         privilege.module = module;
         setGrantedPrivileges((prevState: any[]) => [...prevState, privilege]);
      } else {
         setGrantedPrivileges((prevState: any) => prevState.filter((grantedPrivilege: any) => grantedPrivilege.value !== privilege.value));
      }
   }
   
   return (
      <Row gutter={[16, 16]}>
         <Col sm={24} md={24} xl={12} style={{ display: 'flex', alignItems: 'center' }}>
            <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>
               Back
            </Button>
            <div style={{ display: 'flex', alignItems: 'center' }}>
               <PageTitle title={props.title} style={{ marginLeft: 15 }} />
            </div>
         </Col>
         <Col sm={24} md={24} xl={12} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <Button disabled={submitting} loading={submitting} type="primary" onClick={onSubmit} style={{ marginLeft: 15 }}>
              Submit
            </Button>
         </Col>
         <Col sm={24} md={24} xl={24}>
            <Form
               form={form}
               name="basic"
               layout="vertical"
               onFinish={onFinish}
               autoComplete="off"
            >
               <Row gutter={[20, 0]}>
                  <Col xs={24} sm={24} md={12} xl={6}>
                     <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please enter role name!' }]}
                     >
                        <Input placeholder='Enter role name' />
                     </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={12} xl={6}>
                     <Form.Item
                        label="Rediect To"
                        name="redirect_to"
                        rules={[{ required: true, message: 'Please select redirect page!' }]}
                     >
                        <Select
                           placeholder="Select redirect page"
                           options={state?.redirectablePages ?? []}
                        />
                     </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={12} xl={6}>
                     <Form.Item
                        label="Order"
                        name="sort"
                     >
                        <Input placeholder='Enter order number' />
                     </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={12} xl={6}>
                  <Form.Item
                     label="Status"
                     name="status"
                     rules={[{ required: true, message: 'Please select status!' }]}
                  >
                     <Select
                        placeholder="Select status"
                        options={[
                           { value: 'active', label: 'Active' },
                           { value: 'deactive', label: 'Inactive' }
                        ]}
                     />
                  </Form.Item>
                  </Col>
                  <Col sm={24} md={24} xl={24}>
                     <Row gutter={[40, 15]}>
                        <Col xs={24} sm={24} md={24} xl={24}>
                           <h3 style={{ marginBottom: 0 }}> View Limitation</h3>
                        </Col>
                        <Col xs={24} sm={24} md={12} xl={6}>
                           <Form.Item
                              label="Department"
                              name="departments"
                           >
                              <Select
                                 placeholder="Select accessable departments"
                                 mode="multiple"
                                 options={state.departments}
                              />
                           </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} xl={6}>
                           <Form.Item
                              label="Directorate"
                              name="directorates"
                           >
                              <Select
                                 placeholder="Select accessable directorates"
                                 mode="multiple"
                                 options={state.directorates}
                              />
                           </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} xl={6}>
                           <Form.Item
                              label="Division"
                              name="divisions"
                           >
                              <Select
                                 placeholder="Select accessable divisions"
                                 mode="multiple"
                                 options={state.divisions}
                              />
                           </Form.Item>
                        </Col>
                     </Row>
                  </Col>
                  <Col sm={24} md={24} xl={24}>
                     <Row gutter={[40, 15]}>
                        <Col xs={24} sm={24} md={24} xl={24}>
                           <h3 style={{ marginBottom: 0 }}> Feature Privileges</h3>
                        </Col>
                        {
                           state.privilegeModules.map((module: any, index: number) => 
                              <Col xs={24} sm={24} md={8} xl={6}>
                                 <div style={{ fontSize: 14, fontWeight: 'bold', borderBottom: '1px solid rgb(233, 233, 233)' }}>
                                    {module.label}
                                 </div>
                                 {
                                    module.privileges.length > 1 && 
                                    <Form.Item
                                       name={module.label}
                                       key={index}
                                       style={{ marginBottom: 0, display: 'none' }}
                                    >
                                       <Checkbox onChange={(event: any) => onGrantAll(event, module.key)}>All</Checkbox>
                                    </Form.Item>
                                 }
                                 {
                                    module.privileges?.map((privilege: any, index: number) => 
                                       <Form.Item
                                          name={privilege.value}
                                          key={index}
                                          style={{ marginBottom: 0 }}
                                       >
                                          <Checkbox
                                             checked={grantedPrivileges.findIndex((grantedPrivilege: any) => grantedPrivilege.value === privilege.value) >= 0}
                                             onChange={(event: any) => onGrant(event, module.key, privilege)}>
                                                {privilege.label}
                                          </Checkbox>
                                       </Form.Item>
                                    )
                                 }
                              </Col>  
                           )
                        }
                     </Row>
                  </Col>
               </Row>
               <Button htmlType="submit" style={{ display: 'none' }}>Submit</Button>
            </Form>
         </Col>
      </Row>
   );
});

export default RoleForm;