"use client";

import { CertOption } from "@/lib/db/certoption/schema";
import { cert } from "./cert/data";
import CertDialog from "./cert/cert-dialog";
import CertDrawer from "./cert/cert-drawer";
import { useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function Cert({ options }: { options: CertOption[] }) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <CertDialog open={open} setOpen={setOpen} cert={cert} options={options} />
    );
  }

  return (
    <CertDrawer open={open} setOpen={setOpen} cert={cert} options={options} />
  );
}
