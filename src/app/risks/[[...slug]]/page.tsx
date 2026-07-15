'use client'

import React from "react";
import Browse from "./browse";
import EditAddForm from "./edit-add";
import ImportRisk from "./import";

export default function Page({ params }: { params: { slug: string } }) {
  const slug = params?.slug?.[0];
  if (slug === 'create') {
    return <EditAddForm title="New Risk Entry" />;
  } else if (slug === 'edit') {
    const id = params?.slug?.[1] ?? null;;
    return <EditAddForm title="Edit Risk Entry" id={id} />;
  } else if (slug === 'import') {
    return <ImportRisk title="Import Risk" />;
  }
  
  return <Browse />
}
