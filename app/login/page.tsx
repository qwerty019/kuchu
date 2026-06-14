import Sales from "@/components/main/sales";
import Stories from "@/components/main/stories";
import Search2 from "@/components/search/search2";
import LoginForm from "@/components/login/login-form";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import Loading from "@/components/search/loading";
import { Suspense } from "react";
import { MainModal } from "@/components/modal/main-modal";

export default async function Page() {
  const { user } = await validateRequest();

  if (user) redirect("/");

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
      <MainModal
        title='Авторизация'
        className='h-full lg:h-[700px] flex flex-col'
        path='/login'
      >
        <LoginForm />
      </MainModal>
    </>
  );
}
