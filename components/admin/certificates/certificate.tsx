"use client";

import { CertWithPayments } from "@/lib/db/cert/schema";

export default function Certificate({ cert }: { cert: CertWithPayments }) {
  return (
    <div className='border p-3 rounded-xl text-sm space-y-0.5'>
      <p className='text-muted-foreground text-xs'>
        {cert.number}
        {" · "}
        {cert.certPayments.every((x) => x.status === "paid")
          ? "Оплачен"
          : "Не оплачен"}
      </p>
      <div>
        <p className='font-semibold'>{cert.nominal} ₽</p>
        <p className='text-xs'>{cert.email}</p>
      </div>
      <p className='text-muted-foreground text-xs'>
        Куплен:{" "}
        {new Date(cert.createdAt).toLocaleDateString("ru-RU", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        })}
        {" · "}Истекает:{" "}
        {new Date(cert.expDate).toLocaleDateString("ru-RU", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        })}
      </p>
    </div>
  );
}
