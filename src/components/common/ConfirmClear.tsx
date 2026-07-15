import { Button, Modal } from "antd";
import { ClearOutlined, DeleteOutlined } from "../icons";
import React from "react";

interface ConfirmClearProps {
   record?: any;
   onConfirm: (record: any) => void;
}

export function ConfirmClear(props: ConfirmClearProps) {
   const [open, setOpen] = React.useState(false);

   const hideModal = () => {
      setOpen(false)
   }

   const showConfirmClear = () => {
      if (props.record?.id) {
         props.onConfirm(props.record);
      } else {
         setOpen(true);
      }
      hideModal();
   }

   return <>
      <Button
         icon={<ClearOutlined />}
         style={{ marginLeft: 15 }}
         onClick={showConfirmClear}
      >
         Clear
      </Button>
      <Modal
         title="Are you sure?"
         open={open}
         onOk={props.onConfirm}
         onCancel={hideModal}
         okText="Yes, clear it!"
         okButtonProps={{ danger: true }}
         cancelText="Cancel"
      >
         <p>You won't be able to revert this!</p>
      </Modal>
   </>
}