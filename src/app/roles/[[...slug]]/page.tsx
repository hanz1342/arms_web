'use client'

import React from "react";
import Browse from "./browse";
import EditAddForm from "./edit-add";

export default function Page({ params }: { params: { slug: string } }) {
  const slug = params?.slug?.[0];
  if (slug === 'create') {
    return <EditAddForm title="New Role" reload={() => console.log('reload')} />;
  } else if (slug === 'edit') {
    const id: any = params?.slug?.[1] ?? null;
    return <EditAddForm title="Edit Role" id={id} reload={() => console.log('reload')} />;
  }
  
  return <Browse />
}
