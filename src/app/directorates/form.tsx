'use client';
import React, { useImperativeHandle } from 'react';
import Swal from "sweetalert2";
import { Form, Input, Modal, Select } from '@/components';
import { 
   createDirectorate,
   getDirectorateById,
   updateDirectorateById
} from '@/services';
import { DirectorateInterface } from '@/types/directorate';

const DirectorateForm = React.forwardRef(({reload}: { reload: () => void }, ref: any) => {
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
               setId(null);
               setVisible(false);
            },
         };
      },
      [],
   );

   React.useEffect(() => {
      if (id) {
         getDirectorateById(id)
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


   const onFinish = async (values: DirectorateInterface) => {

      setSubmitting(true);
      if (id) {
         /**
          * Update Directorate
          */
         updateDirectorateById(values, id)
         .then((response: any) => {
            if (response?.error === 'MESSAGE.EXIST') {
               Swal.fire({
                  icon: "error",
                  title: "Directorate Already Exist",
                  text: "The directorate you provided already exist.",
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
                  reload();
                  setId(null);
                  ref.current.close();
               });
            }
         })
         .finally(() => {
            setSubmitting(false);
         })
      } else {
         /**
         * Create Directorate
         */
         createDirectorate(values)
         .then((response: any) => {
            if (response?.error === 'MESSAGE.EXIST') {
               Swal.fire({
                  icon: "error",
                  title: "Directorate Already Exist",
                  text: "The directorate you provided already exist.",
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
                  reload();
                  ref.current.close();
                });
            }
         })
      }


   };

   const onOk = async () => {
      onFinish(form.getFieldsValue());
   }

   return (
      <>
         <Modal
            title={id ? "Edit Directorate" : "New Directorate"}
            okText="Save"
            okButtonProps={{
               loading: submitting
            }}
            style={{ paddingTop: 15 }}
            open={visible}
            centered
            destroyOnClose
            afterClose={() => form.resetFields()}
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

export default DirectorateForm;