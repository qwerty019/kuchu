"use client";

import { Button } from "@/components/ui/button";
import { exportUsers } from "@/lib/db/user/data";
import { formatDateToDDMMYY } from "@/lib/utils";
import { FolderUp, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { utils, writeFile } from "xlsx";

export default function ExportUsers() {
  const [clicked, setClicked] = useState(false);

  async function handleExport() {
    if (clicked) return;

    const confirm = window.confirm(
      "Вы уверены, что хотите экспортировать пользователей?"
    );
    if (!confirm) return;

    setClicked(true);

    try {
      const users = await exportUsers();

      // Process users for Excel export
      const formattedUsers = users.map((user) => ({
        ID: user.id,
        Телефон: user.phone,
        Фамилия: user.surname || "",
        Имя: user.name || "",
        Отчество: user.patronymic || "",
        "Дата рождения": user.dob ? formatDateToDDMMYY(new Date(user.dob)) : "",
        "Заявка на БК": user.applied ? "Да" : "Нет",
      }));

      // Create workbook and worksheet
      const worksheet = utils.json_to_sheet(formattedUsers);
      const workbook = utils.book_new();
      utils.book_append_sheet(workbook, worksheet, "Пользователи");

      // Download file
      writeFile(workbook, "users_export.xlsx");

      toast.success("Пользователи успешно экспортированы.");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Ошибка при экспорте пользователей.");
    } finally {
      setClicked(false);
    }
  }

  return (
    <Button
      type='button'
      className='rounded-full text-xs gap-2'
      variant='secondary'
      size='sm'
      onClick={handleExport}
      disabled={clicked}
    >
      {clicked ? (
        <Loader2 className='w-4 h-4 animate-spin' />
      ) : (
        <>
          <FolderUp className='w-4 h-4' />
          Экспорт
        </>
      )}
    </Button>
  );
}
