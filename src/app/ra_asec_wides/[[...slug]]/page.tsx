'use client'

import React from "react";
import Browse from "./browse";
import EditAddForm from "./edit-add";
import Risks from "./show.detail";
import { useSearchParams } from "@/router";

export default function Page({ params }: { params: { slug: string } }) {
  const slug = params?.slug?.[0];
  if (slug === 'create') {
    return <EditAddForm title="Add New Risk (Risk Aggregate)" />;
  } else if (slug === 'show') {
    const searchParams = useSearchParams()
    const title = `${searchParams.get('lv1')} > ${searchParams.get('lv2')} > ${searchParams.get('lv3')}`;
    return <Risks title={title} />;
  }
  
  return <Browse />
}
