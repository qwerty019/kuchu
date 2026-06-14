"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { read, utils } from "xlsx";
import { ImportIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getGoodsAndCategories } from "@/lib/db/good/data";
import { addCategoryToGood } from "@/lib/db/good/actions";

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
            Категории
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
            const json = utils.sheet_to_json(sheet) as DataItem[];

            try {
              const { categories, goods } = await getGoodsAndCategories();

              const flatten = getFlatten(json, categories);
              if ("message" in flatten) {
                return toast.error(flatten.message);
              }

              const count = { found: 0, skipped: 0 };
              for (const f of flatten.result) {
                const good = goods.find((g) => g.regId === f.regId);
                if (!good) count.skipped++;
                else count.found++;
              }

              const message = `СН: ${flatten.result.length}, СП: ${flatten.skipped}, ТН: ${count.found}, ТП: ${count.skipped}. Продолжить?`;
              const confirm = window.confirm(message);

              if (!confirm) return;

              const founds = [];

              for (const g of goods) {
                const found = flatten.result.find((r) => r.regId === g.regId);
                if (!found) continue;
                founds.push({ id: g.id, category: found.category });
              }

              if (founds.length === 0) {
                return toast.error("Не найдено ни одного товара");
              }

              setClicked(true);

              for (let i = 0; i < founds.length; i++) {
                if (!founds[i].category) continue;

                const action = await addCategoryToGood(
                  founds[i].id,
                  founds[i].category
                );

                if ("message" in action) {
                  toast.error(action.message);
                  return setClicked(false);
                }

                toast.success(`${i + 1} / ${founds.length}`);
              }

              setClicked(false);

              router.refresh();
            } catch (error) {
              console.error("Database Error:", error);
              toast.error("Не удалось импортировать категории и товары.");
            }
          };

          reader.readAsArrayBuffer(file);
        }}
      />
    </>
  );
}

type DataItem = {
  [key: string]: string | number; // Update the type of "2 уровень" to string | undefined
  __rowNum__: number;
};

type Category = {
  id: number;
  title: string;
  parent: {
    id: number;
    title: string;
  } | null;
};

function getFlatten(data: DataItem[], categories: Category[]) {
  const result = [];

  let skipped = 0;
  let count = 2;

  for (const item of data) {
    const levels: { level: number; value: string }[] = [];

    Object.keys(item).forEach((key) => {
      if (key.includes("уровень")) {
        const level = key.split(" ")[0];

        if (isNaN(parseInt(level))) {
          return { message: "Уровень не число" };
        }

        levels.push({ level: parseInt(level), value: item[key] as string });
      }
    });

    if (levels.length === 0) {
      skipped++;
      continue;
    }

    if (levels.length < 2) {
      return { message: `#${count} - Уровни меньше чем 2` };
    }

    levels.sort((a, b) => a.level - b.level);

    const uniqueLevels = new Set(levels.map((l) => l.level));

    if (uniqueLevels.size !== levels.length) {
      return { message: "Уровни одинаковые" };
    }

    const category = categories.find(
      (c) =>
        c.title === levels[levels.length - 1].value &&
        c.parent?.title === levels[levels.length - 2].value
    );

    if (!category) {
      return {
        message: `#${count} - Категория не найдена: ${
          levels[levels.length - 1].value
        }`,
      };
    }

    if (!item["Код товара"]) {
      return { message: `#${count} - Код товара не найден` };
    }

    result.push({
      regId: item["Код товара"],
      name: item["Наименование"],
      category: category.id,
    });

    count++;
  }

  return { result, skipped };
}
