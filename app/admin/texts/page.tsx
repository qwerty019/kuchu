export const dynamic = "force-dynamic";

import { Text } from "@/components/admin/texts/text";
import { AddNavText } from "@/components/admin/texts/text-actions";
import Empty from "@/components/ui/custom/empty";
import { fetchTexts } from "@/lib/db/navtext/data";
import { isAdmin } from "@/lib/utils-server";

export default async function Page() {
  await isAdmin("/admin/texts");

  const texts = await fetchTexts();

  return (
    <main className='admin-page space-y-6'>
      <section className='flex items-center justify-between'>
        <h1 className='scroll-m-20 text-3xl font-extrabold tracking-tight'>
          Текста
        </h1>
        <AddNavText />
      </section>
      <section className='space-y-1'>
        {texts.map((text) => (
          <Text key={text.id} text={text} />
        ))}
        {texts.length === 0 && <Empty message='Нет текстов' />}
      </section>
    </main>
  );
}
