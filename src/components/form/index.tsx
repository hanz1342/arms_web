import { CSSProperties } from "react";
import { Form, Input, InputNumber, Select, FormRule, DatePicker } from "antd";
import { BaseOptionType } from "antd/es/select";

interface FormItemProps {
   label?: string;
   name: string | any;
   placeholder: string;
   autoSize?: any;
   disabled?: boolean;
   readOnly?: boolean;
   required?: boolean;
   defaultValue?: any;
   options?: BaseOptionType[];
   allowClear?: boolean;
   showSearch?: boolean;
   mode?: 'multiple' | 'tags';
   picker?: 'week' | 'month' | 'quarter' | 'year';
   rules?: FormRule[];
   style?: CSSProperties,
   inputStyle?: CSSProperties,
   onChange?: (value: any) => void
}

export function InputItem(props: FormItemProps) {
   const rules: FormRule[] = props.rules ?? [{ required: props.required }];

   return <Form.Item
      label={props.label}
      name={props.name}
      style={props.style}
      rules={rules}
   >
      <Input
         placeholder={props.placeholder}
         defaultValue={props.defaultValue}
         disabled={props.disabled}
         readOnly={props.readOnly}
         style={props.inputStyle}
         onChange={props.onChange}
      />
   </Form.Item>;
}

export function DatePickerItem(props: FormItemProps) {
   return <Form.Item
      label={props.label}
      name={props.name}
      style={props.style}
   >
      <DatePicker picker={props.picker} format={'DD-MM-YYYY'} />
   </Form.Item>;
}

export function NumberItem(props: FormItemProps) {
   return <Form.Item
      label={props.label}
      name={props.name}
      style={props.style}
      rules={props.rules}
   >
      <InputNumber
         placeholder={props.placeholder}
         disabled={props.disabled}
         style={props.style}
      />
   </Form.Item>;
}

export function TextAreaItem(props: FormItemProps) {
   const rules: FormRule[] = props.rules ?? [{ required: props.required, message: `Please enter ${props.name}` }];
   return <Form.Item
      label={props.label}
      name={props.name}
      style={props.style}
      rules={rules}
   >
      <Input.TextArea
         placeholder={props.placeholder}
         defaultValue={props.defaultValue}
         autoSize={props.autoSize}
      />
   </Form.Item>;
}

export function SelectItem(props: FormItemProps) {
   const rules: FormRule[] = props.rules ?? [{ required: props.required, message: `Please enter ${props.name}` }];

   return <Form.Item
      label={props.label}
      name={props.name}
      rules={rules}
      style={props.style}
   >
      <Select
         mode={props.mode}
         placeholder={props.placeholder}
         defaultValue={props.defaultValue}
         options={props.options}
         onChange={props.onChange}
         allowClear={props.allowClear}
         showSearch={props.showSearch}
      />
   </Form.Item>
}
