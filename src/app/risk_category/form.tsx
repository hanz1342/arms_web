import React, { useImperativeHandle } from 'react'
import Swal from 'sweetalert2'
import { Button, Form, Input, Modal, Select } from '@/components'
import { getRiskCategoryById, createRiskCategory, updateRiskCategoryById } from '@/services/risk-category'

interface CategoryFormProps {
   reload: () => void;
}

const CategoryForm = React.forwardRef((props: CategoryFormProps, ref: any) => {
   const [visible, setVisible] = React.useState<boolean>(false)
   const [submitting, setSubmitting] = React.useState<boolean>(false)
   const [id, setId] = React.useState('')
   const [form] = Form.useForm()

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
         getRiskCategoryById(id)
         .then((response: any) => {
            if (response) {
               form.setFieldsValue({
                  ...response
               })
            }
         })
         .catch(error => console.log('error:', error))
      }
   }, [id]);


   const onFinish = (values: any) => {
      setSubmitting(true);
      if (id) {
         updateRiskCategoryById(values, id)
         .then((response: any) => {
            if (response?.error === 'MESSAGE.EXIST') {
               Swal.fire({
                  icon: "error",
                  title: "Risk Category Already Exist",
                  text: `The risk category[${response?.message}] you provided already exist.`,
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
            setSubmitting(false);
         })
      } else {
         createRiskCategory(values)
         .then((response: any) => {
            if (response?.error === 'MESSAGE.EXIST') {
               Swal.fire({
                  icon: "error",
                  title: "Impact Category Already Exist",
                  text: `The risk category[${response?.message}] you provided already exist.`,
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
      const values = await form.validateFields();
      onFinish(values);
   }

   return <Modal 
      title={id ? "Edit Category" : "New Category"}
      okText="Save"
      style={{ paddingTop: 15 }}
      open={visible}
      centered
      destroyOnClose
      afterClose={() => { form.resetFields(); setId('') }}
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
               label="Level 1"
               name="Level1"
               rules={[{required: true, message: "Please enter risk category level 1"}]}
               >
               <Input placeholder='Enter level 1' />
            </Form.Item>

            <Form.Item
               label="Level 2"
               name="Level2"
               rules={[{required: true, message: "Please enter risk category level 2"}]}
               >
               <Input placeholder='Enter level 2' />
            </Form.Item>

            <Form.Item
               label="Level 3"
               name="Level3"
               rules={[{required: true, message: "Please enter risk category level 3"}]}
               >
               <Input.TextArea placeholder='Enter level 3' />
            </Form.Item>

            <Form.Item
               label="Status"
               name="Enabled"
               >
               <Select defaultValue={'yes'} placeholder="Select status">
                  <Select.Option value="Yes">Yes</Select.Option>
                  <Select.Option value="No">No</Select.Option>
               </Select>
            </Form.Item>
            <Button htmlType="submit" style={{ display: 'none' }}>Submit</Button>
         </Form>
   </Modal>
});

export default CategoryForm;