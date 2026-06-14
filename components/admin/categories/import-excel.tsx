"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { read, utils } from "xlsx";
import { ImportIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createOrUpdate, deleteRest } from "@/lib/db/category/actions";

export default function ImportExcel() {
  const uploadRef = useRef<HTMLInputElement | null>(null);
  const [clicked, setClicked] = useState(false);
  const router = useRouter();

  return (
    <>
      <Button
        type='button'
        className='rounded-full text-xs gap-2'
        variant='secondary'
        size='sm'
        onClick={() => uploadRef.current?.click()}
        disabled={clicked}
      >
        {clicked ? (
          <Loader2 className='w-4 h-4 animate-spin' />
        ) : (
          <>
            <ImportIcon className='w-4 h-4' />
            Импорт
          </>
        )}
      </Button>
      <Input
        ref={uploadRef}
        className='hidden w-0 h-0 opacity-0'
        type='file'
        accept='.xlsx, .xls'
        onClick={(e: React.MouseEvent<HTMLInputElement>) => {
          const inputElement = e.target as HTMLInputElement;
          inputElement.value = "";
        }}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          if (!e.target.files) return;
          if (e.target.files.length !== 1) return;

          const file = e.target.files[0];
          const reader = new FileReader();

          reader.onload = async (e) => {
            if (!e.target) return;
            if (!e.target.result) return;
            if (typeof e.target.result !== "object") return;

            const data = new Uint8Array(e.target.result);
            const workbook = read(data, { type: "array" });

            const sheetName = window.prompt("Введите название листа");
            if (!sheetName) return;
            if (!workbook.SheetNames.includes(sheetName)) {
              return alert("Лист не найден");
            }

            const sheet = workbook.Sheets[sheetName];
            const json = utils.sheet_to_json(sheet);

            const flatten = createFlatten(json as DataItem[]);

            if ("message" in flatten) {
              return toast.error(flatten.message);
            }

            const text = `Найдено ${flatten.length} категорий. Продолжить?`;
            const confirm = window.confirm(text);

            if (!confirm) return;

            setClicked(true);

            for (let i = 0; i < flatten.length; i++) {
              const action = await createOrUpdate(flatten[i]);

              if ("message" in action) {
                setClicked(false);
                return toast.error(action.message);
              }

              flatten[i].id = action.id;

              const children = flatten.filter(
                (x) =>
                  x.parentTitle === flatten[i].title &&
                  x.level === flatten[i].level + 1
              );

              children.forEach((child) => {
                child.parentId = action.id;
              });

              toast.success(`${i + 1} / ${flatten.length}`);
            }

            const action = await deleteRest(flatten.map((x) => x.id as number));

            if ("message" in action) {
              setClicked(false);
              return toast.error(action.message);
            }

            toast.success("Готово");

            setClicked(false);

            router.refresh();
          };

          reader.readAsArrayBuffer(file);
        }}
      />
    </>
  );
}

type DataItem = {
  [key: string]: string | number;
  __rowNum__: number;
};

export type Flatten = {
  level: number;
  title: string;
  parentTitle: string | null;
  parentId: number | null;
  id?: number;
};

function createFlatten(arr: DataItem[]) {
  const result: Flatten[] = [];

  for (const item of arr) {
    const levels: { level: number; value: string }[] = [];

    Object.keys(item).forEach((key) => {
      if (key.includes("уровень")) {
        const level = key.split(" ")[0];

        if (isNaN(parseInt(level))) {
          return { message: "Уровень должен быть числом." };
        }

        if (level === "4") {
          return { message: "4 уровня не должно быть." };
        }

        levels.push({
          level: parseInt(level),
          value: item[key].toString().trim(),
        });
      }
    });

    levels.sort((a, b) => a.level - b.level);

    const uniqueLevels = new Set(levels.map((l) => l.level));

    if (uniqueLevels.size !== levels.length) {
      return { message: "Уровни должны быть уникальны." };
    }

    for (let i = 0; i < levels.length; i++) {
      const value = levels[i].value;
      if (!value) {
        return {
          message: `Пустая категория: ${levels
            .map((x) => `${x.level} уровень: ${x.value}`)
            .join(", ")}`,
        };
      }

      const newItem = {
        level: levels[i].level,
        title: levels[i].value,
        parentTitle: levels[i - 1]?.value || null,
        parentId: null,
      };

      const found = result.find(
        (a) =>
          a.title === newItem.title &&
          a.level === newItem.level &&
          a.parentTitle === newItem.parentTitle
      );
      if (found) continue;

      result.push(newItem);
    }
  }

  result.sort((a, b) => {
    if (a.level !== b.level) {
      return a.level - b.level;
    }
    if (a.parentTitle !== b.parentTitle) {
      if (a.parentTitle === null) return -1;
      if (b.parentTitle === null) return 1;
      return a.parentTitle.localeCompare(b.parentTitle);
    }
    return a.title.localeCompare(b.title);
  });

  return result;
}
