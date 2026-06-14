"use client";

import { DynamicForm } from "@/components/forms";
import { Button } from "@/components/ui/button";
import { fetchAllCategories } from "@/lib/db/category/data";
import {
  addCategoryToCollection,
  addGoodsToCollection,
} from "@/lib/db/collGood/actions";
import { AddCategorySchema, AddGoodsSchema } from "@/lib/db/collGood/schema";
import { Check, ChevronsUpDown, Loader2, Trash2 } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { searchGoods } from "@/lib/db/good/data";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";
import { cn } from "@/lib/utils";

export function AddCategory({ collectionId }: { collectionId: number }) {
  return (
    <DynamicForm
      formSchema={AddCategorySchema}
      action={async (data) => {
        return await addCategoryToCollection(data);
      }}
      title='Добавить категорию'
      buttonText='Добавить'
      trigger={
        <Button
          type='button'
          className='rounded-full text-xs'
          variant='secondary'
          size='sm'
        >
          Добавить категорию
        </Button>
      }
      initialData={{ collectionId }}
      sections={[
        {
          name: "categoryId",
          placeholder: "Выберите категорию",
          type: "combobox",
          dataFetcher: async () => {
            const data = await fetchAllCategories({ parentId: "notNull" });
            return data;
          },
          required: true,
        },
      ]}
    />
  );
}

export function AddGoods({ collectionId }: { collectionId: number }) {
  return (
    <DynamicForm
      formSchema={AddGoodsSchema}
      action={async (data) => {
        return await addGoodsToCollection(data);
      }}
      title='Добавить товары'
      buttonText='Добавить'
      trigger={
        <Button
          type='button'
          className='rounded-full text-xs'
          variant='secondary'
          size='sm'
        >
          Добавить товары
        </Button>
      }
      initialData={{ collectionId }}
      renderForm={({ form }) => <Goods form={form} />}
    />
  );
}

function Goods({
  form,
}: {
  form: UseFormReturn<z.infer<typeof AddGoodsSchema>>;
}) {
  const [selected, setSelected] = useState<Good[]>([]);

  return (
    <div className='space-y-3'>
      <Search form={form} setSelected={setSelected} selected={selected} />
      {selected.length > 0 && (
        <div className='flex flex-col gap-1 text-xs'>
          {selected.map((good) => (
            <div
              key={good.id}
              className='w-full border rounded-xl p-2 flex items-center justify-between gap-2'
            >
              <div>
                <p className='font-medium'>{good.drug}</p>
                <p>{good.form}</p>
                <p className='text-muted-foreground'>{good.category?.title}</p>
              </div>
              <Button
                type='button'
                variant='outline'
                size='icon'
                className='w-8 h-8 shrink-0'
                onClick={() => {
                  const filtered = selected.filter((x) => x.id !== good.id);
                  setSelected(filtered);
                  form.setValue(
                    "goods",
                    filtered.map((x) => x.id),
                    { shouldDirty: true }
                  );
                }}
              >
                <Trash2 className='w-4 h-4' />
              </Button>
            </div>
          ))}
        </div>
      )}
      {selected.length === 0 && (
        <div className='flex justify-center items-center h-24 bg-[#F2F2F2] rounded-xl p-2'>
          <p className='text-xs text-muted-foreground'>Список пуст</p>
        </div>
      )}
    </div>
  );
}

function Search({
  form,
  setSelected,
  selected,
}: {
  form: UseFormReturn<z.infer<typeof AddGoodsSchema>>;
  setSelected: React.Dispatch<React.SetStateAction<Good[]>>;
  selected: Good[];
}) {
  const [results, setResults] = useState<Good[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const handleSearch = useDebouncedCallback(async (value) => {
    if (loading) return;

    if (!value) {
      setResults([]);
      return;
    }

    setLoading(true);

    try {
      const goods = await searchGoods(value);
      setResults(goods);
    } catch (err) {
      console.log(err);
      toast.error(err instanceof Error ? err.message : "Что-то пошло не так.");
    } finally {
      setLoading(false);
    }
  }, 300);

  return (
    <div className='relative w-full'>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className='w-full justify-between rounded-full text-xs bg-[#F2F2F2] py-4 px-4 border-none'
          >
            Поиск товара...
            <ChevronsUpDown className='opacity-50 w-4 h-4' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-full max-w-[296px] p-0'>
          <Command shouldFilter={false}>
            <div className='relative'>
              <CommandInput
                placeholder='Поиск товара...'
                className='h-9'
                value={query}
                onValueChange={(v) => {
                  setQuery(v);
                  handleSearch(v);
                }}
              />
              {loading && (
                <div className='absolute top-1/2 right-2 -translate-y-1/2'>
                  <Loader2 className='h-4 w-4 animate-spin text-muted-foreground' />
                </div>
              )}
            </div>
            <CommandList>
              <CommandEmpty className='w-full text-muted-foreground text-xs'>
                Ничего не найдено.
              </CommandEmpty>
              <CommandGroup>
                {results.map((result) => (
                  <CommandItem
                    key={result.id.toString()}
                    value={result.id.toString()}
                    onSelect={() => {
                      setSelected((prev) => {
                        const updated = [...prev];
                        const filtered = updated.find((x) => x.id === result.id)
                          ? updated.filter((g) => g.id !== result.id)
                          : [...updated, result];

                        form.setValue(
                          "goods",
                          filtered.map((x) => x.id),
                          { shouldDirty: true }
                        );

                        return filtered;
                      });
                      setOpen(false);
                    }}
                  >
                    <div className='text-xs'>
                      <p className='font-medium'>{result.drug}</p>
                      <p>{result.form}</p>
                      <p className='text-muted-foreground'>
                        {result.category?.title}
                      </p>
                    </div>
                    <Check
                      className={cn(
                        "w-4 h-4 ml-auto",
                        selected.find((x) => x.id === result.id)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

type Good = {
  id: number;
  drug: string;
  form: string;
  category: {
    title: string;
  } | null;
};
