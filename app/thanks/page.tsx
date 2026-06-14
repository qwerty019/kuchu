import Sales from "@/components/main/sales";
import Stories from "@/components/main/stories";
import Search2 from "@/components/search/search2";
import { notFound, redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import ThanksCert from "@/components/cart/thanks-cert";
import Loading from "@/components/search/loading";
import { Suspense } from "react";
import { MainModal } from "@/components/modal/main-modal";
import { db } from "@/db";
import { cert } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { user } = await validateRequest();

  if (!user) redirect("/");

  const { certId } = searchParams;

  if (!certId) redirect("/");

  const cert = await getCert(`${certId}`);

  if (!cert) notFound();

  if ("message" in cert) {
    throw new Error(cert.message);
  }

  return (
    <>
      <main className='relative main-page'>
        <Suspense fallback={<Loading />}>
          <Search2 hideOnMobile />
        </Suspense>
        <section className='flex flex-col gap-6'>
          <Stories />
          <Sales />
        </section>
      </main>
      <MainModal title='' className='h-auto sm:max-h-[700px]'>
        <ThanksCert />
      </MainModal>
    </>
  );
}

async function getCert(certId: string) {
  try {
    const found = await db.query.cert.findFirst({
      where: and(eq(cert.isDeleted, false), eq(cert.id, Number(certId))),
      columns: { id: true, number: true },
    });

    return found;
  } catch (error) {
    return { message: "Ошибка при получении сертификата. Повторите еще." };
  }
}
