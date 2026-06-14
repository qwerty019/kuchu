import { DataTable } from "./data-table";
import { columns } from "./columns";
import { fetchUsers } from "@/lib/db/user/data";

export default async function UsersList({
  page,
  limit,
  query,
}: {
  page: string;
  limit: string;
  query?: string;
}) {
  const users = await fetchUsers({ page, limit, query });

  return (
    <DataTable
      data={users}
      limit={parseInt(limit)}
      columns={columns}
      page={Number(page)}
    />
  );
}
