"use client";

import { Button } from "@/components/ui/button";
import Dialog from "@/components/ui/custom/dialog";
import { Input } from "@/components/ui/input";
import { GoodAdmin } from "@/lib/db/good/schema";
import { Inventory, RlsParsed } from "@/lib/rls";
import { cn } from "@/lib/utils";
import { Check, Loader2, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { addImageFromRlsToGood } from "@/lib/db/good/actions";

type Result =
  | {
    query: string;
    message: string;
  }
  | {
    query: string;
    inventories: Inventory[];
  };

type ImageResult = {
  url: string;
  selected: boolean;
};

type SectionResult = {
  section: string;
  text: string;
  selected: boolean;
};

export function RlsImport({
  good,
  open,
  setOpen,
}: {
  good: GoodAdmin;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [descId, setDescId] = useState<string | null>(
    good.descId?.toString() ?? null
  );
  const [drug, setDrug] = useState(good.drug + " " + good.form);
  const [fabr, setFabr] = useState(good.fabr);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [searched, setSearched] = useState(false);
  const [images, setImages] = useState<ImageResult[]>([]);
  const [sections, setSections] = useState<SectionResult[]>([]);
  const [clicked, setClicked] = useState(false);

  async function searchByEan(ean: string) {
    if (!ean) {
      toast.error("Штрихкод не указан");
      return;
    }

    if (loading || loading2) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/import/rls/search?ean=${ean}`);
      if (!res.ok) {
        const data: { message: string } = await res.json();
        throw new Error(data.message);
      }

      const data: Result[] = await res.json();
      setResults(data);
      setSearched(true);
    } catch (err) {
      console.log(err);
      toast.error(
        err instanceof Error
          ? err.message
          : "Что-то пошло не так. Повторите еще."
      );
    } finally {
      setLoading(false);
    }
  }

  async function searchByDrug(drug: string, fabr?: string) {
    if (!drug && !fabr) {
      toast.error("Название товара и производитель не указаны");
      return;
    }

    if (loading || loading2) return;

    setLoading2(true);

    try {
      const res = await fetch(
        `/api/import/rls/search?drug=${drug}&fabr=${fabr}`
      );
      if (!res.ok) {
        const data: { message: string } = await res.json();
        throw new Error(data.message);
      }

      const data: Result[] = await res.json();
      setResults(data);
      setSearched(true);
    } catch (err) {
      console.log(err);
      toast.error(
        err instanceof Error
          ? err.message
          : "Что-то пошло не так. Повторите еще."
      );
    } finally {
      setLoading2(false);
    }
  }

  async function getDescription(desc_id: string | null) {
    if (!desc_id) {
      toast.error("Идентификатор не указан");
      return;
    }

    if (loading3) return;

    setLoading3(true);

    try {
      const res = await fetch(`/api/import/rls/description?desc_id=${desc_id}`);
      if (!res.ok) {
        const data: { message: string } = await res.json();
        throw new Error(data.message);
      }

      const data: RlsParsed = await res.json();
      setImages(data.images.map((img, i) => ({ url: img, selected: i === 0 })));
      setSections(
        data.sections.map((section) => ({
          section: section.section,
          text: section.text,
          selected: true,
        }))
      );
    } catch (err) {
      console.log(err);
      toast.error(
        err instanceof Error
          ? err.message
          : "Что-то пошло не так. Повторите еще."
      );
    } finally {
      setLoading3(false);
    }
  }

  async function handleAdd() {
    const selectedImages = images.filter((img) => img.selected);

    if (selectedImages.length !== 1) {
      toast.error("Выберите только одно изображение");
      return;
    }

    setClicked(true);

    const action = await addImageFromRlsToGood(good.id, good.regId, selectedImages[0].url);

    if ("message" in action) {
      toast.error(action.message);
    } else {
      toast.success("Изображение успешно добавлено");
    }

    setClicked(false);
  }

  return (
    <Dialog title='Импорт RLS' open={open} setOpen={setOpen}>
      <div className='space-y-6 flex flex-col min-w-0'>
        <div className='space-y-2'>
          <div>
            <p className='font-semibold'>Идентификатор РЛС</p>
            <p className='text-xs text-muted-foreground'>
              Если не указан, то будет произведен поиск по штрихкоду.
            </p>
          </div>
          <div className='flex gap-1 items-center'>
            <Input
              placeholder='Введите идентификатор'
              className='w-full rounded-full text-xs bg-[#F2F2F2] py-4 px-4 border-none'
              value={descId ?? ""}
              onChange={(e) =>
                e.target.value ? setDescId(e.target.value) : setDescId(null)
              }
            />
            <Button
              type='button'
              onClick={() => getDescription(descId)}
              size='icon'
              className='rounded-full h-10 w-10 shrink-0'
              disabled={!descId || loading3}
            >
              {loading3 ? (
                <Loader2 className='w-4 h-4 animate-spin' />
              ) : (
                <Search className='w-4 h-4' />
              )}
            </Button>
          </div>
          {(images.length > 0 || sections.length > 0) && (
            <div className='space-y-3 border rounded-xl p-3'>
              <div className='space-y-2'>
                <p className='font-semibold text-sm leading-none'>
                  Изображения
                </p>
                <div className='flex gap-1 overflow-x-auto -mx-3 px-3'>
                  {images.map((image, i) => (
                    <Button
                      key={i}
                      variant='outline'
                      type='button'
                      size='icon'
                      className='w-24 h-24 rounded-xl relative overflow-hidden shrink-0'
                      onClick={() =>
                        setImages(
                          images.map((img, k) => ({
                            ...img,
                            selected: k === i ? !img.selected : false,
                          }))
                        )
                      }
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image.url}
                        alt={image.url}
                        className='w-24 h-24 object-contain'
                      />
                      <div
                        className={cn(
                          "w-5 h-5 rounded-full border absolute bottom-1 left-1 flex items-center justify-center shrink-0",
                          image.selected &&
                          "bg-primary border-primary text-white"
                        )}
                      >
                        {image.selected && <Check className='w-3 h-3' />}
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
              <Button
                type='button'
                size='sm'
                className='rounded-full text-xs h-8'
                onClick={() => handleAdd()}
                disabled={clicked}
              >
                {clicked ? (
                  <Loader2 className='w-4 h-4 animate-spin' />
                ) : (
                  "Добавить"
                )}
              </Button>
              <div className='space-y-2'>
                <p className='font-semibold text-sm leading-none'>Описание</p>
                <div className='space-y-1'>
                  {sections.map((section, i) => (
                    <div
                      key={i}
                      className='w-full rounded-xl border text-xs p-3 flex gap-3'
                    >
                      <Button
                        type='button'
                        size='icon'
                        variant='outline'
                        className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center shrink-0",
                          section.selected &&
                          "bg-primary border-primary text-white"
                        )}
                        onClick={() =>
                          setSections(
                            sections.map((sec, k) =>
                              k === i
                                ? { ...sec, selected: !sec.selected }
                                : sec
                            )
                          )
                        }
                      >
                        {section.selected && <Check className='w-3 h-3' />}
                      </Button>
                      <div className='space-y-1'>
                        <p className='text-muted-foreground'>
                          {section.section}
                        </p>
                        <p>{section.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <Button
                type='button'
                size='sm'
                className='rounded-full text-xs h-8'
                disabled
              >
                Добавить
              </Button>
            </div>
          )}
        </div>
        <div className='space-y-2'>
          <div>
            <p className='font-semibold'>Поиск товара в РЛС</p>
            <p className='text-xs text-muted-foreground'>
              Если не указан, то будет произведен поиск по штрихкоду.
            </p>
          </div>
          <div className='space-y-3'>
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={() => searchByEan(good.ean)}
              className='rounded-full text-xs w-full h-10 gap-2'
              disabled={loading || loading2}
            >
              {loading ? (
                <>
                  <Loader2 className='w-4 h-4 animate-spin' />
                  Подождите...
                </>
              ) : (
                "Поиск товара в РЛС по штрихкоду"
              )}
            </Button>
            <p className='text-xs text-muted-foreground text-center'>или</p>
            <div className='space-y-1'>
              <Input
                placeholder='Название товара'
                className='w-full rounded-full text-xs bg-[#F2F2F2] py-4 px-4 border-none'
                value={drug}
                onChange={(e) => setDrug(e.target.value)}
              />
              <Input
                placeholder='Производитель'
                className='w-full rounded-full text-xs bg-[#F2F2F2] py-4 px-4 border-none'
                value={fabr}
                onChange={(e) => setFabr(e.target.value)}
              />
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => searchByDrug(drug, fabr)}
                className='rounded-full text-xs w-full h-10 gap-2'
                disabled={loading || loading2}
              >
                {loading2 ? (
                  <>
                    <Loader2 className='w-4 h-4 animate-spin' />
                    Подождите...
                  </>
                ) : (
                  "Поиск товара по названию"
                )}
              </Button>
            </div>
          </div>
          {searched && (
            <div className='space-y-1'>
              {results.length === 0 && (
                <div className='border rounded-xl p-2 flex items-center justify-center h-24'>
                  <p className='text-xs text-muted-foreground'>
                    Товар не найден
                  </p>
                </div>
              )}
              {results.map((item, i) => {
                if ("message" in item) {
                  return (
                    <div key={i} className='border rounded-xl p-2'>
                      <p className='text-xs text-muted-foreground'>
                        {item.query}
                      </p>
                      <p className='text-sm'>{item.message}</p>
                    </div>
                  );
                }

                return item.inventories.map((inventory, k) => (
                  <div key={k} className='border rounded-xl p-2 space-y-2'>
                    <div>
                      <p className='text-xs text-muted-foreground'>
                        {item.query}
                      </p>
                      <p className='text-sm'>{inventory.prep_full}</p>
                      <p className='text-xs text-muted-foreground'>
                        {inventory.packing_full}
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        {inventory.firms}
                      </p>
                    </div>
                    <Button
                      type='button'
                      size='sm'
                      className='rounded-full text-xs h-8'
                      onClick={() => {
                        if (!inventory.desc_id) {
                          toast.error("Не найдено");
                        } else {
                          setDescId(inventory.desc_id.toString());
                          getDescription(inventory.desc_id.toString());
                        }
                      }}
                      disabled={!inventory.desc_id}
                    >
                      {inventory.desc_id ? "Выбрать" : "Не найдено"}
                    </Button>
                  </div>
                ));
              })}
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
}
