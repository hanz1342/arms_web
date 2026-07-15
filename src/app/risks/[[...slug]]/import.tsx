'use client'

import React from "react";
import Swal from "sweetalert2";
import {
  Button,
  Col,
  PageTitle,
  Row,
  Form,
  Upload,
  message,
  Modal,
  Spin
} from '@/components';
import {
  ArrowLeftOutlined,
  DownloadOutlined,
  InboxOutlined
} from '@icons';
import type { UploadFile, UploadProps } from 'antd';
import axios from "axios";
import { useRouter } from "@/router";
import { getHeaders } from "@/services";
import Link from "next/link";

export default function ImportRisk({ title }: { title: string }) {
  const [visible, setVisible] = React.useState<boolean>(false)
  const [file, setFile] = React.useState<any>(null)
  const [submitting, setSubmitting] = React.useState<boolean>(false)
  const [fileList, setFileList] = React.useState<UploadFile[]>([])
  const router = useRouter()

  const props: UploadProps = {
    onRemove: (file) => {
      setFile(null);
    },
    beforeUpload: (file) => {
      setFile(file);
      return false;
    },
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
        setFile(info.file)
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
    fileList
  };

  if (file) {
    props.fileList = [file];
  }

  const onSubmit = () => {
    const formData = new FormData();
    formData.append('file', file, file.name);
    setSubmitting(true);

    axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/risks/import`, formData, {
      headers: {
        ...getHeaders(),
        'Content-Type': 'multipart/form-data'
      },
    })
    .then((response: any) => {
      response = response?.data;
      if (response?.message === 'SUCCESS') {
        setTimeout(() => {
          setFile(null);
          setSubmitting(false);
          Swal.fire({
            icon: "success",
            title: "You imported risk successfully.",
            showConfirmButton: false,
            timer: 1500
          })
        }, 1500)
      } else if (response?.error === 'NO.FILE') {
        setTimeout(() => {
          setFile(null);
          setSubmitting(false);
          Swal.fire({
            icon: "error",
            title: "File not found on your importing.",
            showConfirmButton: false
          })
        }, 1500)
      }
    })
    .catch((error: any) => {
      console.log('upload failed.', error);
    });
  }
  
  return (<Spin spinning={submitting}>
    <Row gutter={[16, 16]}>
        <Modal
          title="Are you sure?"
          open={visible}
          onOk={onSubmit}
          onCancel={() => setVisible(false)}
          okText={'Yes, import now'}
          okButtonProps={{ danger: true }}
          cancelText={'Cancel'}
        >
          <p>You won't be able to revert this!</p>
        </Modal>
      <Col sm={24} md={6} xl={6} style={{ display: 'flex', alignItems: 'center' }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>
          Back
        </Button>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <PageTitle title={title} style={{ marginLeft: 15 }} />
        </div>
      </Col>

      <Col sm={24} md={18} xl={18} style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Link href={'/../template/import-risk-template.xlsx'} download='import-risk-template.xlsx'>
          <Button
            icon={<DownloadOutlined />}
          >
            Download Template
          </Button>
        </Link>
        <Button
          type="primary"
          loading={submitting}
          disabled={submitting}
          style={{ marginLeft: 15 }}
          onClick={onSubmit}
        >
          Submit
        </Button>
          {/* <Input placeholder="Search draft risk event..." autoFocus={true} style={{ width: 250 }} prefix={<SearchOutlined />} allowClear onChange={onSearch} /> */}
      </Col>

      <Col sm={24} md={24} xl={24}>
        <div
          style={{ height: window?.innerHeight - (file > 0 ? 450 : 150) }}
        >
          <Upload.Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined style={{ fontSize: 50 }} />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to import</p>
            <p className="ant-upload-hint">
              Support for a single upload. Strictly prohibited from uploading risks information.
            </p>
          </Upload.Dragger>
        </div>
      </Col>
    </Row>
    </Spin>)
}
