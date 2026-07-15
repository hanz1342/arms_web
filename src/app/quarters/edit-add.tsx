'use client';
import React, { useImperativeHandle } from 'react';
import Swal from "sweetalert2";
import dayjs from 'dayjs';
import { Button, DatePicker, Form, Modal, Select } from '@/components';
import { 
   createQuarter,
   getQuarterById, 
   updateQuarterById, 
   getAllQuarters 
} from '@/services';
import { InputItem, SelectItem } from '@form';

interface QuarterFormProps {
   reload: () => void;
};

const monthNames = [
   'January', 'February', 'March', 'April', 'May', 'June',
   'July', 'August', 'September', 'October', 'November', 'December'
 ];

const QuarterForm = React.forwardRef((props: QuarterFormProps, ref: any) => {

   const [selectedYear, setSelectedYear] = React.useState(0);
   const [visible, setVisible] = React.useState<boolean>(false);
   const [submitting, setSubmitting] = React.useState<boolean>(false);
   const [quarters, setQuarters] = React.useState<any[]>([]);
   const [months, setMonths] = React.useState(Array.from({ length: 12 }, (_, index) => ({
      label: monthNames[index],
      value: index + 1,
      disabled: false
    })));
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
         getQuarterById(id)
         .then((response: any) => {
            if (response && response?.months) {
               response.months = JSON.parse(response.months);
               if (!Array.isArray(response.months)) {
                  delete response.months;
               }
               
               form.setFieldsValue({
                  ...response,
                  quarterYear: dayjs(`${response.year}-01-01`, 'YYYY')
               });
            }
         })
         .catch(error => console.log('error:', error));
      }

      getAllQuarters()
      .then((response: any) => {
         if (response?.data) {
            setQuarters(response.data);
         }
      })
   }, [id]);

   const onChangeCycle = async (event: any) => {
      const cycle: string = event.target.value;
      
      if (selectedYear) {
         mappingMonth(selectedYear, cycle);
      }
   }

   const onChangeYear = async (value: any) => {
      const year = parseInt(value.format('YYYY'));
      const cycle: string = (await form.getFieldValue('name')) || "";
      
      mappingMonth(year, cycle);

      setSelectedYear(year);
   }

   const mappingMonth = async (year: number, cycle: string) => {
      
      quarters.forEach((quarter: any) => {
         console.log(`${quarter.name.toLowerCase() === cycle.toLowerCase()}, ${year} == ${quarter.year}`);
      });

      const values = Array.from({ length: 12 }, (_, index) => ({
         label: monthNames[index],
         value: index + 1,
         disabled: isMonthInCycle(quarters, year, cycle, index + 1)
      }));

      setMonths(values);
   }

   const isMonthInCycle = (quarters: any[], selectedYear: number, cycle: string, currentMonth: number) => {
      let inCycle: boolean = false;
      quarters.forEach((quarter: any) => {
         if (quarter.year === selectedYear && quarter.name.toLowerCase() === cycle.toLowerCase()) {
            const months: any[] = JSON.parse(quarter.months);
            inCycle = months.findIndex((month: number) => month === currentMonth) >= 0;
         }
      });
      return inCycle;
   };

   const onFinish = async (values: any) => {
      values.year = values.quarterYear.format('YYYY');
      values.months = JSON.stringify(values.months);
      setSubmitting(true);
      if (id) {
         /**
          * Update Quarter
          */
         updateQuarterById(values, id)
         .then((response: any) => {
            if (response?.error === 'MESSAGE.EXIST') {
               Swal.fire({
                  icon: "error",
                  title: "Quarter Already Exist",
                  text: "The quarter you provided already exist.",
                  showConfirmButton: false,
                  timer: 1500
               });
            } else if (response?.error === 'MONTH.EXIST') {
               Swal.fire({
                  icon: "error",
                  title: "Month Already Exist",
                  text: `These months ${JSON.parse(response.months).map((month: any) => monthNames[month]).join(',')} already used in ${dayjs(response.year).format('YYYY')} of ${response.cycle}.`,
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
         * Create Quarter
         */
         createQuarter(values)
         .then((response: any) => {
            if (response?.error === 'MESSAGE.EXIST') {
               Swal.fire({
                  icon: "error",
                  title: "Quarter Already Exist",
                  text: "The quarter you provided already exist.",
                  showConfirmButton: false,
                  timer: 1500
               })
            } else if (response?.error === 'MONTH.EXIST') {
               Swal.fire({
                  icon: "error",
                  title: "Month Already Exist",
                  text: `These months ${JSON.parse(response.months).map((month: any) => monthNames[month]).join(',')} already used in ${dayjs(response.year).format('YYYY')} of ${response.cycle}.`,
                  showConfirmButton: false
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
      const values = await form.validateFields();
      onFinish(values);
   }

   return (
      <Modal
            title={id ? "Edit Quarter" : "New Quarter"}
            okText="Save"
            style={{ paddingTop: 15 }}
            open={visible}
            centered
            destroyOnClose
            afterClose={() => {
               form.resetFields();
               setId(null);
            }}
            okButtonProps={{ loading: submitting }}
            onOk={onOk}
            onCancel={() => setVisible(false)}>
            <Form
               form={form}
               name="basic"
               layout="vertical"
               onFinish={onFinish}
               autoComplete="off"
            >
               <InputItem
                  label='Name'
                  name='name'
                  placeholder='Enter name'
                  onChange={onChangeCycle}
                  rules={[{ required: true }]}
               />
               <Form.Item
                  name="quarterYear"
                  label="Year"
                  rules={[{required: true, message: 'Please select year'}]}
               >
                  <DatePicker
                     picker="year"
                     style={{width: '100%'}}
                     onChange={onChangeYear}
                  />
               </Form.Item>
               <SelectItem
                  label='Start From'
                  name='months'
                  mode="multiple"
                  placeholder='Select months'
                  rules={[{ required: true }]}
                  options={months}
                  style={{ width: '100%' }}
               />
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
               <Button htmlType='submit' style={{ display: 'none' }} />
            </Form>
         </Modal>
   );
});

export default QuarterForm;