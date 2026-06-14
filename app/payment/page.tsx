import Payment from "@/components/payment/payment";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const { user } = await validateRequest();

  if (!user) redirect("/");

  const { token, certId } = searchParams;

  if (!token) redirect("/");

  return (
    <main className='relative main-page space-y-6'>
      <h1 className='scroll-m-20 text-3xl font-extrabold tracking-tight mt-4'>
        Платеж
      </h1>
      <Payment token={token} certId={certId} />
    </main>
  );
}
