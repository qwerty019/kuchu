export const dynamic = "force-dynamic";

import CertOption from "@/components/admin/certificates/cert-option";
import { AddCertOption } from "@/components/admin/certificates/cert-option-actions";
import Certificate from "@/components/admin/certificates/certificate";
import Empty from "@/components/ui/custom/empty";
import { fetchCerts } from "@/lib/db/cert/data";
import { fetchCertOptions } from "@/lib/db/certoption/data";
import { isAdmin } from "@/lib/utils-server";

export default async function Page() {
  await isAdmin("/admin/certificates");

  const certOptions = await fetchCertOptions();
  const certs = await fetchCerts();

  return (
    <main className='admin-page space-y-6'>
      <section className='flex items-center justify-between gap-2'>
        <h1 className='scroll-m-20 text-3xl font-extrabold tracking-tight'>
          Сертификаты
        </h1>
        <AddCertOption />
      </section>
      {certOptions.length > 0 && (
        <section className='flex flex-wrap gap-2'>
          {certOptions.map((option) => (
            <CertOption key={option.id} option={option} />
          ))}
        </section>
      )}
      <section className='space-y-2'>
        {certs.map((cert) => (
          <Certificate key={cert.id} cert={cert} />
        ))}
        {certs.length === 0 && <Empty message='Нет сертификатов' />}
      </section>
    </main>
  );
}
