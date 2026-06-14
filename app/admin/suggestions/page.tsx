export const dynamic = "force-dynamic";

import { AddSuggestion } from "@/components/admin/suggestions/suggestion-actions";
import Suggestion from "@/components/admin/suggestions/suggestion";
import { getSuggestions } from "@/lib/db/suggestion/data";
import { isAdmin } from "@/lib/utils-server";

export default async function Page() {
  await isAdmin("/admin/suggestions");

  const suggestions = await getSuggestions();

  return (
    <main className='admin-page space-y-6'>
      <section className='flex justify-between items-center'>
        <h1 className='scroll-m-20 text-3xl font-extrabold tracking-tight'>
          Подсказки
        </h1>
        <AddSuggestion />
      </section>
      <ol className='space-y-1 max-w-md'>
        {suggestions.map((suggestion) => (
          <Suggestion key={suggestion.id} suggestion={suggestion} />
        ))}
      </ol>
    </main>
  );
}
