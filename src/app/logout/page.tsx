'use client';
import { Button, Result } from "@/components";
import React from "react";
import { deleteCookie } from 'cookies-next';
import { useRouter } from "@/router";

export default function Page() {
   const router = useRouter();
   
   React.useEffect(() => {
      deleteCookie('token')
      router.replace('/auth')
   }, []);
   return <Result
      title="Your operation has been executed"
      extra={
      <Button type="primary" key="console">
         Go Console
      </Button>
      }
   />
}