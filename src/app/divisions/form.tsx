'use client';
import React, { useImperativeHandle } from 'react';
import Swal from "sweetalert2";
import { Form, Input, Modal, Select } from '@/components';
import { createDivision, getDivisionById, updateDivisionById } from '@/services';
import { DivisionInterface } from '@/types/division';
interface DivisionFormProps {
   reload: () => void;
};

const DivisionForm = React.forwardRef((props: DivisionFormProps, ref: any) => {
   const [visible, setVisible] = React.useState<boolean>(false);
   const [submitting, setSubmitting] = React.useState<boolean>(false);
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
         getDivisionById(id)
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


   const onFinish = async (values: DivisionInterface) => {
      setSubmitting(true);
      if (id) {
         updateDivisionById(values, id)
            .then((response: any) => {
               if (response?.error === 'MESSAGE.EXIST') {
                  Swal.fire({
                     icon: "error",
                     title: "Division Already Exist",
                     text: "The division you provided already exist.",
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
                     form.validateFields();
                     ref.current.close();
                  });
               }
            })
            .finally(() => {
               setSubmitting(false);
            })
      } else {
         createDivision(values)
         .then((response: any) => {
            if (response?.error === 'MESSAGE.EXIST') {
               Swal.fire({
                  icon: "error",
                  title: "Division Already Exist",
                  text: "The division you provided already exist.",
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
            setSubmitting(false);
         })
      }


   };

   const onOk = async () => {
      onFinish(form.getFieldsValue());
   }

   return (
      <>
         <Modal
            title={id ? "Edit Division" : "New Division"}
            okText="Save"
            style={{ paddingTop: 15 }}
            open={visible}
            centered
            destroyOnClose
            afterClose={() => {
               form.resetFields();
               setId(null);
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
            </Form>
         </Modal>
      </>
   );
});

export default DivisionForm;