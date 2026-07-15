'use client';
import React, { useImperativeHandle } from 'react';
import Swal from "sweetalert2";
import { Button, Form, Input, Modal, Select } from '@/components';
import { createImpactCategory, getImpactCategoryById, updateImpactCategoryById } from '@/services';
import { ImpactCategoryInterface } from '@/types';

interface ImpactCategoryFormProps {
   reload: () => void;
};

const ImpactCategoryForm = React.forwardRef((props: ImpactCategoryFormProps, ref: any) => {
   const [visible, setVisible] = React.useState<boolean>(false);
   const [submit, setSubmit] = React.useState<boolean>(false);
   const [id, setId] = React.useState<number | null>(null);
   const [form] = Form.useForm();

   useImperativeHandle(
      ref,
      () => {
         return {
            open(id?: number) {
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
         getImpactCategoryById(id)
            .then((response: any) => {
               if (response) {
                  form.setFieldsValue({
                     ...response,
                  });
               }
            })
            .catch(error => console.log('error:', error));
      }
   }, [id]);


   const onFinish = (values: ImpactCategoryInterface) => {
      setSubmit(true);

      if (id) {
         updateImpactCategoryById(values, id)
         .then((response: any) => {
            if (response?.error === 'MESSAGE.EXIST') {
               Swal.fire({
                  icon: "error",
                  title: "Impact Category Already Exist",
                  text: "The impact category you provided already exist.",
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
                  props.reload();
                  ref.current.close();
               });
            }
         })
         .finally(() => {
            setSubmit(false);
            setId(null)
         })
      } else {
         createImpactCategory(values)
            .then((response: any) => {
               if (response?.error === 'MESSAGE.EXIST') {
                  Swal.fire({
                     icon: "error",
                     title: "Impact Category Already Exist",
                     text: "The impact category you provided already exist.",
                     showConfirmButton: false,
                     timer: 1500
                  })
               } else {
                  Swal.fire({
                     icon: "success",
                     title: "Your work has been created",
                     showConfirmButton: false,
                     timer: 1500
                   })
                   .then(() => {
                     props.reload();
                     form.validateFields();
                     ref.current.close();
                   });
               }
            })
            .finally(() => {
               setSubmit(false);
            })
      }


   };

   const onOk = () => {
      onFinish(form.getFieldsValue());
   }

   return (
      <>
         <Modal
            title={id ? "Edit Impact Category" : "New Impact Category"}
            okText="Save"
            style={{ paddingTop: 15 }}
            open={visible}
            centered
            destroyOnClose
            afterClose={() => {
               form.resetFields()
               setId(null)
            }}
            onOk={onOk}
            onCancel={() => setVisible(false)}>
            <Form
               form={form}
               name="basic"
               layout="vertical"
               onFinish={onFinish}
               autoComplete="off"
            >
               <Form.Item
                  label="Name"
                  name="name"
                  rules={[{ required: true, message: 'Please enter name!' }]}
               >
                  <Input placeholder='Enter Name' />
               </Form.Item>
               <Form.Item
                  label="Status"
                  name="status"
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
      </>
   );
});

export default ImpactCategoryForm;