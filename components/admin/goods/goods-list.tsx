import { fetchGoods } from "@/lib/db/good/data";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Option } from "@/lib/definitions";

export default async function GoodsList({
  page,
  limit,
  query,
  category,
  categories,
}: {
  page: string;
  limit: string;
  query?: string;
  category?: string;
  categories: Option[];
}) {
  const goods = await fetchGoods({ page, limit, query, category });

  return (
    <DataTable
      data={goods}
      limit={parseInt(limit)}
      columns={columns}
      categories={categories}
    />
  );
}
