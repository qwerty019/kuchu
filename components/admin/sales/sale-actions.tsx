"use client";

import {
  InputField,
  DynamicForm,
  TextareaField,
  ComboboxField,
  CheckboxField,
  MultiField,
} from "@/components/forms";
import { InputImageField } from "@/components/forms/fields/input-image-field";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { getGoods, searchGoods } from "@/lib/db/good/data";
import { addSale, deleteSale, editSale } from "@/lib/db/sale/actions";
import { fetchSale } from "@/lib/db/sale/data";
import { AddSaleSchema } from "@/lib/db/sale/schema";
import { Option } from "@/lib/definitions";
import {
  Check,
  ChevronsUpDown,
  Loader2,
  PlusCircle,
  Trash2,
  Upload,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";
import { z } from "zod";
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
import { cn } from "@/lib/utils";
import { uploadToS3 } from "@/lib/upload";

export function AddSale({
  categories,
  branches,
}: {
  categories: Option[];
  branches: Option[];
}) {
  return (
    <DynamicForm
      formSchema={AddSaleSchema}
      action={async (data) => {
        return await addSale(data);
      }}
      title='Добавить акцию'
      initialData={{
        title: "",
        img: "",
        position: null,
        subtitle: null,
        text: null,
        show: false,
        selected: false,
        images: [""],
        salebranches: [],
        salegoods: [],
      }}
      trigger={
        <Button className='p-2 items-start h-auto relative w-[100px] aspect-[3/4] bg-accent rounded-xl hover:bg-accent/80'>
          <div className='bg-background p-2 text-xs rounded-full text-primary w-full'>
            Создать
          </div>
        </Button>
      }
      renderForm={({ form }) => (
        <FieldGroup className='gap-4'>
          <div className='flex flex-col gap-2'>
            <MultiField
              control={form.control}
              name='salebranches'
              placeholder='Выберите филиал'
              options={branches}
            />
            <InputImageField
              control={form.control}
              name='img'
              placeholder='Добавьте фото 600х900'
              folder='sale'
            />
            <InputField
              control={form.control}
              name='title'
              placeholder='Введите название'
            />
            <InputField
              control={form.control}
              name='subtitle'
              placeholder='Введите подзаголовок'
            />
            <TextareaField
              control={form.control}
              name='text'
              placeholder='Введите текст'
            />
            <div className='flex gap-2'>
              <InputField
                control={form.control}
                name='startDate'
                placeholder='Дата начала'
                type='date'
              />
              <InputField
                control={form.control}
                name='endDate'
                placeholder='Дата окончания'
                type='date'
              />
            </div>
            <InputField
              control={form.control}
              name='position'
              placeholder='Введите позицию'
            />
            <CheckboxField
              control={form.control}
              name='show'
              label='Показывать'
            />
          </div>
          <Images form={form} />
          <SaleGoods form={form} categories={categories} salegoods={[]} />
        </FieldGroup>
      )}
    />
  );
}

export function EditSale({
  id,
  categories,
  branches,
  open,
  setOpen,
}: {
  id: number;
  categories: Option[];
  branches: Option[];
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <DynamicForm
      open={open}
      setOpen={setOpen}
      formSchema={AddSaleSchema}
      action={async (data) => {
        return await editSale(id, data);
      }}
      title='Редактировать акцию'
      initialDataFetcher={async () => {
        const data = await fetchSale(id);
        return {
          title: data.title,
          img: data.img,
          position: data.position,
          show: data.show,
          selected: data.selected,
          salebranches: data.salebranches,
          salegoods: data.salegoods,
          categoryId: data.categoryId,
          startDate: new Date(data.startDate).toISOString().split("T")[0],
          endDate: new Date(data.endDate).toISOString().split("T")[0],
          images: data.images || [],
          subtitle: data.subtitle,
          text: data.text,
        };
      }}
      buttonText='Редактировать'
      deleteAction={async () => {
        return await deleteSale(id);
      }}
      deleteConfirmDescription='Это действие нельзя отменить. Акция и все связанные с ним данные будут удалены навсегда.'
      trigger={
        <Button
          className='rounded-full text-xs gap-2'
          variant='secondary'
          size='sm'
        >
          Добавить сториз
        </Button>
      }
      renderForm={({ form, initial }) => (
        <FieldGroup className='gap-4'>
          <div className='flex flex-col gap-2'>
            <MultiField
              control={form.control}
              name='salebranches'
              placeholder='Выберите филиал'
              options={branches}
            />
            <InputImageField
              control={form.control}
              name='img'
              placeholder='Добавьте фото 600х900'
              folder='sale'
            />
            <InputField
              control={form.control}
              name='title'
              placeholder='Введите название'
            />
            <InputField
              control={form.control}
              name='subtitle'
              placeholder='Введите подзаголовок'
            />
            <TextareaField
              control={form.control}
              name='text'
              placeholder='Введите текст'
            />
            <div className='flex gap-2'>
              <InputField
                control={form.control}
                name='startDate'
                placeholder='Дата начала'
                type='date'
              />
              <InputField
                control={form.control}
                name='endDate'
                placeholder='Дата окончания'
                type='date'
              />
            </div>
            <InputField
              control={form.control}
              name='position'
              placeholder='Введите позицию'
            />
            <CheckboxField
              control={form.control}
              name='show'
              label='Показывать'
            />
            <CheckboxField
              control={form.control}
              name='selected'
              label='Выбрать как текущую акцию'
            />
          </div>
          <Images form={form} />
          <SaleGoods
            form={form}
            categories={categories}
            salegoods={initial.salegoods}
          />
        </FieldGroup>
      )}
    />
  );
}

function SaleGoods({
  form,
  categories,
  salegoods,
}: {
  form: UseFormReturn<z.infer<typeof AddSaleSchema>>;
  categories: Option[];
  salegoods?: number[] | null;
}) {
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Good[]>([]);

  useEffect(() => {
    async function getResults() {
      if (!salegoods || salegoods.length === 0) return;

      setLoading(true);

      try {
        const goods = await getGoods(salegoods);
        setSelected(goods);
      } catch (err) {
        console.log(err);
        toast.error(
          err instanceof Error ? err.message : "Что-то пошло не так."
        );
      } finally {
        setLoading(false);
      }
    }

    getResults();
  }, [salegoods]);

  return (
    <div className='border rounded-xl p-3 space-y-3'>
      <div className='flex items-center justify-between'>
        <h3 className='text-base font-semibold'>Товары</h3>
        {loading && (
          <Loader2 className='w-4 h-4 animate-spin text-muted-foreground' />
        )}
      </div>
      <ComboboxField
        control={form.control}
        name='categoryId'
        placeholder='Выберите категорию'
        options={categories}
        nullable
      />
      <div className='flex items-center justify-center'>
        <p className='text-xs text-muted-foreground'>или</p>
      </div>
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
                    "salegoods",
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
  form: UseFormReturn<z.infer<typeof AddSaleSchema>>;
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
                          "salegoods",
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

function Images({
  form,
}: {
  form: UseFormReturn<z.infer<typeof AddSaleSchema>>;
}) {
  const images = form.watch("images");
  const error = form.formState.errors.images;

  if (!images) return null;

  return (
    <div className='border rounded-xl p-3 space-y-3'>
      <h3 className='text-base font-semibold'>Изображения</h3>
      {images.map((img, index) => (
        <div key={index} className='space-y-1'>
          <div className='flex items-center gap-2'>
            <ImageInput
              form={form}
              value={img}
              onChange={(value) => {
                const updated = [...images];
                updated[index] = value;
                form.setValue("images", updated, { shouldDirty: true });
              }}
              folder='sale'
            />
            {images.length > 1 ? (
              <Button
                type='button'
                variant='secondary'
                className='rounded-full bg-[#F2F2F2] h-10 w-10 p-0 justify-center shrink-0'
                onClick={() => {
                  const filtered = images.filter((_, i) => i !== index);
                  form.setValue("images", filtered, { shouldDirty: true });
                }}
              >
                <Trash2 className='w-4 h-4' />
              </Button>
            ) : null}
          </div>
          {error ? (
            <p className='text-destructive text-xs'>{error[index]?.message}</p>
          ) : null}
        </div>
      ))}
      <div className='w-full flex justify-center'>
        <Button
          type='button'
          variant='outline'
          size='sm'
          className='rounded-full text-xs gap-2'
          onClick={() =>
            form.setValue("images", [...images, ""], { shouldDirty: true })
          }
        >
          <PlusCircle className='w-3 h-3' />
          Добавить изображение
        </Button>
      </div>
    </div>
  );
}

function ImageInput({
  form,
  value,
  onChange,
  folder,
}: {
  form: UseFormReturn<z.infer<typeof AddSaleSchema>>;
  value: string;
  onChange: (value: string) => void;
  folder: string;
}) {
  const [clicked, setClicked] = useState(false);
  const uploadRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className='relative w-full'>
      <Input
        className='w-full rounded-full text-xs bg-[#F2F2F2] py-4 pl-4 pr-11 border-none'
        placeholder='Добавьте фото 600х900'
        onChange={(e) => onChange(e.target.value)}
        value={value}
      />
      <Button
        size='icon'
        type='button'
        className='absolute top-1 right-1 w-8 h-8 rounded-full'
        disabled={clicked}
        onClick={() => {
          if (clicked) return;
          uploadRef.current?.click();
        }}
      >
        {clicked ? (
          <Loader2 className='w-3 h-3 animate-spin' />
        ) : (
          <Upload className='w-3 h-3' />
        )}
      </Button>
      <input
        ref={uploadRef}
        className='hidden w-0 h-0 opacity-0'
        type='file'
        accept='.jpeg, .jpg, .png, .gif'
        onClick={(e: React.MouseEvent<HTMLInputElement>) => {
          const inputElement = e.target as HTMLInputElement;
          inputElement.value = "";
        }}
        onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
          if (!e.target.files) return;
          if (e.target.files.length !== 1) return;
          if (clicked) return;

          const file = e.target.files[0];
          const fileExt = file.name.split(".").pop();

          if (!fileExt || !extensions.includes(fileExt)) {
            toast.error("Неверный формат изображения");
            return;
          }

          setClicked(true);

          try {
            const alterName = new Date().getTime();
            const formData = new FormData();
            formData.append("file", file);

            const uploadResult = await uploadToS3(
              formData,
              `${alterName}.${fileExt}`,
              folder,
              true,
            );

            setClicked(false);
            onChange(uploadResult.url);
          } catch (error) {
            console.log(error);
            setClicked(false);
            toast.error(
              error instanceof Error ? error.message : "Что-то пошло не так."
            );
          }
        }}
      />
    </div>
  );
}

const extensions = ["jpeg", "jpg", "png", "gif"];
