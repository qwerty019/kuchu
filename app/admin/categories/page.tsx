import { AddCategory } from "@/components/admin/categories/category-actions";
import ImportExcel from "@/components/admin/categories/import-excel";
import { SortableTree } from "@/components/admin/categories/sortable/sortable-tree";
import {
  fetchAllCategories,
  fetchCategoriesInAdmin,
} from "@/lib/db/category/data";
import { isAdmin } from "@/lib/utils-server";

export default async function Page() {
  await isAdmin("/admin/categories");

  const nestedCategories = await fetchCategoriesInAdmin();
  const allCategories = await fetchAllCategories({ parentId: undefined });

  return (
    <main className='admin-page space-y-6'>
      <section className='flex items-center justify-between gap-2'>
        <h1 className='scroll-m-20 text-3xl font-extrabold tracking-tight'>
          Список категорий
        </h1>
        <div className='flex items-center gap-1'>
          <ImportExcel />
          <AddCategory categories={allCategories} parentId={null} />
        </div>
      </section>
      <SortableTree
        collapsible
        indicator
        defaultItems={nestedCategories}
        categories={allCategories}
      />
    </main>
  );
}
