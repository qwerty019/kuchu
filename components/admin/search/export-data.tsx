"use client";

import { Button } from "@/components/ui/button";
import { exportSearchs } from "@/lib/db/search/data";
import { FolderUp, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { utils, writeFile } from "xlsx";

export default function ExportData() {
  const [clicked, setClicked] = useState(false);

  async function handleExport() {
    if (clicked) return;

    setClicked(true);

    try {
      const searchs = await exportSearchs();
      // Process users for Excel export
      const formattedUsers = searchs.map((s) => ({
        ID: s.id,
        Запрос: s.query,
        Дата: new Date(s.createdAt).toLocaleDateString("ru-RU", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        Телефон: s.user?.phone || "",
        Имя: s.user?.name || "",
        Фамилия: s.user?.surname || "",
      }));

      // Create workbook and worksheet
      const worksheet = utils.json_to_sheet(formattedUsers);
      const workbook = utils.book_new();
      utils.book_append_sheet(workbook, worksheet, "Поисковые запросы");

      // Download file
      writeFile(workbook, "searchs_export.xlsx");

      toast.success("Поисковые запросы успешно экспортированы.");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Ошибка при экспорте поисковых запросов.");
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
