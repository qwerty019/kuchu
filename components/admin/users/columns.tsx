"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "./data-table-row-actions";
import { UserInAdmin } from "@/lib/db/user/schema";
import { formatDateToDDMMYY, formatDateToHHMM, getFullName } from "@/lib/utils";

export const columns: ColumnDef<UserInAdmin>[] = [
  {
    accessorKey: "id",
    header: "#",
    cell: ({ row, table }) => {
      const { page, limit } = table.options.meta as {
        page: number;
        limit: number;
      };

      const index = row.index + 1 + (page - 1) * limit;

      return <div>{index}</div>;
    },
  },
  {
    accessorKey: "Телефон",
    header: () => <div className='text-center'>Телефон</div>,
    cell: ({ row }) => {
      return <div className='text-center'>{row.original.phone}</div>;
    },
  },
  {
    accessorKey: "ФИО",
    header: () => <div className='text-center'>ФИО</div>,
    cell: ({ row }) => {
      return <div className='text-center'>{getFullName(row.original)}</div>;
    },
  },
  {
    accessorKey: "Дата регистрации",
    header: () => <div className='text-center'>Дата регистрации</div>,
    cell: ({ row }) => {
      return (
        <div className='text-center'>
          <p>{formatDateToDDMMYY(row.original.createdAt)}</p>
          <p className='text-xs text-muted-foreground'>
            {formatDateToHHMM(row.original.createdAt)}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "Дата рождения",
    header: () => <div className='text-center'>Дата рождения</div>,
    cell: ({ row }) => {
      const formattedDate = formatDateToDDMMYY(row.original.dob);
      return <div className='text-center'>{formattedDate || ""}</div>;
    },
  },
  {
    accessorKey: "Заявка на БК",
    header: () => <div className='text-center'>Заявка на БК</div>,
    cell: ({ row }) => {
      const applied = row.original.applied;
      return <div className='text-center'>{applied ? "Да" : ""}</div>;
    },
  },
  {
    accessorKey: "Роли",
    header: () => <div className='text-center'>Роли</div>,
    cell: ({ row }) => {
      const roles = row.original.roles?.join(", ") || "";
      return <div className='text-center'>{roles}</div>;
    },
  },
  {
    accessorKey: "Бонусная карта",
    header: () => <div className='text-center'>Бонусная карта</div>,
    cell: ({ row }) => {
      const discountCards = row.original.discountCards;

      if (discountCards.length === 0) {
        return <div className='text-center'>Нет</div>;
      }

      const dc = discountCards[0];

      return <div className='text-center'>{dc.accumulation}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const { setUsers } = table.options.meta as {
        setUsers: React.Dispatch<React.SetStateAction<UserInAdmin[]>>;
      };

      return <DataTableRowActions user={row.original} setUsers={setUsers} />;
    },
  },
];
