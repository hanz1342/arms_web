import React, { useImperativeHandle } from 'react'
import Swal from "sweetalert2"
import { Button, Form, Input, Modal, Select } from '@/components'
import { getEmployeeById, createNewEmployee, updateEmployeeById } from '@/services'
import { useEmployeeOptions } from "@/hooks";

interface EmployeeFormProps {
   reload: () => void;
}

const EmployeeForm = React.forwardRef((props: EmployeeFormProps, ref: any) => {

   const [visible, setVisible] = React.useState<boolean>(false)
   const [submitting, setSubmitting] = React.useState<boolean>(false)
   const [id, setId] = React.useState('')
   const [form] = Form.useForm()
   const { options } = useEmployeeOptions();

   useImperativeHandle(
      ref,
      () => {
        return {
          open(id?: string) {
            setVisible(true);
            setId(id!);
          },
          close() {
            setVisible(false);
          },
        };
      },
      [],
   );

   React.useEffect(() => {
      if (id) {
         getEmployeeById(id)
         .then((response: any) => {
            if (response) {
               try {
                  const roleIds = JSON.parse(response.roleIds);
                  if (roleIds?.length > 0) {
                     response.roleIds = roleIds;
                  }

               } catch (e) {
                  response.roleIds = [];
               }
               
               form.setFieldsValue({
                  ...response,
                  roleIds: response.roleIds
               });
            }
         })
         .catch(error => console.log('error:', error))
      }
   }, [id]);


   const onFinish = (values: any) => {
      setSubmitting(true);
      values.roleIds = JSON.stringify(values.roleIds);
      if (id) {
         updateEmployeeById(values, id)
         .then((response: any) => {
            if (response?.error && response?.error === 'MESSAGE.EMAIL.TAKEN') {
               Swal.fire({
                  icon: "error",
                  title: "Email Already Taken",
                  text: "The provided email address is already in use.",
                  showConfirmButton: false,
                  timer: 1500
               })
            } else {
               Swal.fire({
                  icon: "success",
                  title: "Your work has been updated",
                  showConfirmButton: false,
                  timer: 1500
               })
               .then(() => {
                  setId('');
                  props.reload();
                  form.validateFields();
                  ref.current.close();
               })
            }
         })
         .catch((error: any) => {
            console.log(error);
         })
         .finally(() => {
            setSubmitting(false);
         })
      } else {
         createNewEmployee(values)
         .then((response: any) => {
            if (response?.error && response?.error === 'MESSAGE.EMAIL.TAKEN') {
               Swal.fire({
                  icon: "error",
                  title: "Email Already Taken",
                  text: "The provided email address is already in use.",
                  showConfirmButton: false,
                  timer: 1500
               })
            } else {
               Swal.fire({
                  icon: "success",
                  title: "New user has been created!",
                  showConfirmButton: false,
                  timer: 1500
               })
               .then(() => {
                  setId('');
                  props.reload();
                  form.validateFields();
                  ref.current.close();
               })
            }
         })
         .finally(() => {
            setSubmitting(false);
         })
      }
   };

   const onOk = async () => {
      const values = await form.validateFields();
      onFinish(values);
   }

   return <Modal 
      title={id ? "Edit Employee" : "New Employee" }
      okText="Save"
      style={{ paddingTop: 15 }}
      open={visible}
      centered
      destroyOnClose
      afterClose={() => {
         form.resetFields()
         setId('')
      }}
      onOk={onOk}
      okButtonProps={{ loading: submitting, disabled: submitting }}
      onCancel={() => setVisible(false)}>
         <Form
            form={form}
            name="basic"
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
         >
            <Form.Item
               label="First Name"
               name="Firstname"
               rules={[{ required: true, message: 'Please input your firstname!' }]}
               >
               <Input placeholder='Enter first name' />
            </Form.Item>

            <Form.Item
               label="Last Name"
               name="Lastname"
               rules={[{ required: true, message: 'Please input your lastname!' }]}
               >
               <Input placeholder='Enter last name' />
            </Form.Item>

            <Form.Item
               label="Middle name"
               name="Middlename"
               rules={[{ required: true, message: 'Please input your middlename!' }]}
               >
               <Input placeholder='Enter middle name' />
            </Form.Item>

            <Form.Item
               label="Department"
               name="Department"
               rules={[{ required: true, message: 'Please select department!' }]}
            >
               <Select
                  placeholder="Select department"
                  options={options?.departments ?? []}
                  allowClear
               />
            </Form.Item>

            <Form.Item
               label="Directorate"
               name="Directorate"
               rules={[{ required: true, message: 'Please select directorate!' }]}
               >
               <Select 
                  placeholder="Select directorate" 
                  options={options?.directorates ?? []}
                  allowClear
               />
            </Form.Item>

            <Form.Item
               label="Division"
               name="Division"
               rules={[{ required: true, message: 'Please select division!' }]}
               >
               <Select
                  placeholder="Select division"
                  options={options.divisions}
                  allowClear
               />
            </Form.Item>

            <Form.Item
               label="Email"
               name="EmailID"
               rules={[{ required: true, type: 'email', message: 'Please input a valid email address!' }]}
               >
               <Input placeholder="Enter email" />
            </Form.Item>

            <Form.Item
               label="Position"
               name="Position"
               rules={[{ required: true, message: 'Please input position!' }]}
            >
               <Input placeholder="Enter position" />
            </Form.Item>

            <Form.Item
               label="Role"
               name="roleIds"
               rules={[{ required: true, message: 'Please select role!' }]}
            >
               <Select
                  mode="multiple"
                  placeholder="Select role"
                  options={options?.userTypes ?? []}
                  allowClear
               />
            </Form.Item>

            <Form.Item
               label="Status"
               name="Active"
               rules={[{ required: true, message: 'Please select status!' }]}
            >
               <Select
                  placeholder="Select status"
                  options={[
                     { value: 1, label: 'Active' },
                     { value: 0, label: 'Inactive' }
                  ]}
               />
            </Form.Item>
            <Button htmlType="submit" style={{ display: 'none' }}>Submit</Button>
         </Form>
   </Modal>
});

export default EmployeeForm;