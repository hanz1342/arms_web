import { Button, Modal } from "antd";
import Swal from "sweetalert2";
import { DeleteOutlined } from "../icons";
import React from "react";

interface Permission {
   restrict?: boolean;
   noPermission?: boolean;
}

interface ConfirmDeleteProps {
   record?: any;
   deleting?: boolean;
   permission?: Permission;
   onConfirm: (record: any) => void;
}

export function ConfirmDelete(props: ConfirmDeleteProps) {
   const [open, setOpen] = React.useState(false);

   const hideModal = () => {
      setOpen(false);
   }

   const showConfirmOrDelete = () => {
      if (props.permission?.restrict) {
         if (props.permission.noPermission) {
            Swal.fire({
               icon: "warning",
               title: "Insufficient Permissions",
               text: "You do not have the necessary permissions to perform this operation.",
               showConfirmButton: false,
               timer: 3000
            });
            return;
         }
      }

      if (props.record?.id && props.record?.status !== 'NEW') {
         setOpen(true);
      } else if (props.record?.id) {
         setOpen(true);
      } else {
         props.onConfirm(props.record);
         hideModal();
      }
   }

   const onOk = () => {
      props.onConfirm(props.record);
      hideModal();
   }

   return <>
      <Button
         type="primary"
         danger
         shape="circle"
         icon={<DeleteOutlined />}
         onClick={showConfirmOrDelete}
      />
      <Modal
         title="Are you sure?"
         open={open}
         onOk={onOk}
         onCancel={hideModal}
         okText="Yes, delete it!"
         okButtonProps={{ danger: true, loading: props.deleting, disabled: props.deleting }}
         cancelText="Cancel"
      >
         <p>You won't be able to revert this!</p>
      </Modal>
   </>
}