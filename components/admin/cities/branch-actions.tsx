"use client";

import { DynamicForm } from "@/components/forms";
import { Button } from "@/components/ui/button";
import { addBranch, deleteBranch, editBranch } from "@/lib/db/branch/actions";
import { fetchBranchInEdit } from "@/lib/db/branch/data";
import { AddBranchSchema, EditBranchSchema } from "@/lib/db/branch/schema";
import { getBranchList } from "@/lib/farmbazis/data";

export function AddBranch({ cityId }: { cityId: number }) {
  return (
    <DynamicForm
      formSchema={AddBranchSchema}
      action={async (data) => {
        return await addBranch(data);
      }}
      title='Добавить филиал'
      initialData={{ cityId }}
      trigger={
        <Button
          className='rounded-full text-xs gap-2'
          variant='secondary'
          size='sm'
        >
          Добавить филиал
        </Button>
      }
      sections={[
        {
          type: "input",
          name: "title",
          placeholder: "Название",
          required: true,
        },
        {
          name: "address",
          placeholder: "Адрес",
          type: "input",
          required: true,
        },
        {
          name: "fbId",
          placeholder: "Филиал в Farmbazis",
          type: "combobox",
          dataFetcher: async () => {
            const data = await getBranchList();
            return data.map((branch) => ({
              value: branch.branchId.toString(),
              label: branch.branch,
            }));
          },
          nullable: true,
          required: true,
        },
        {
          name: "main",
          label: "Главный филиал",
          type: "checkbox",
          required: true,
        },
      ]}
    />
  );
}

export function EditBranch({
  id,
  open,
  setOpen,
}: {
  id: number;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <DynamicForm
      open={open}
      setOpen={setOpen}
      formSchema={EditBranchSchema}
      action={async (data) => {
        return await editBranch(id, data);
      }}
      title='Редактировать филиал'
      initialDataFetcher={async () => {
        const data = await fetchBranchInEdit(id);
        return {
          title: data.title,
          address: data.address,
          fbId: data.fbId,
          main: data.main,
          lat: data.lat,
          long: data.long,
        };
      }}
      buttonText='Редактировать'
      deleteAction={async () => {
        return await deleteBranch(id);
      }}
      deleteConfirmDescription='Это действие нельзя отменить. Филиал и все связанные с ним данные будут удалены навсегда.'
      sections={[
        {
          type: "input",
          name: "title",
          placeholder: "Название",
          required: true,
        },
        {
          name: "address",
          placeholder: "Адрес",
          type: "input",
          required: true,
        },
        {
          name: "fbId",
          placeholder: "Филиал в Farmbazis",
          type: "combobox",
          dataFetcher: async () => {
            const data = await getBranchList();
            return data.map((branch) => ({
              value: branch.branchId.toString(),
              label: branch.branch,
            }));
          },
          nullable: true,
          required: false,
        },
        {
          name: "main",
          label: "Главный филиал",
          type: "checkbox",
        },
      ]}
    />
  );
}
