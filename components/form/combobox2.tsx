import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { useDebounce } from "use-debounce";

type Item = {
  value: number | string;
  label: string;
  desc?: string;
};

export default function FormCombobox2({
  form,
  name,
  placeholder,
  desc,
  url,
  nullable,
  valueAsNumber,
}: {
  form: any;
  name: string;
  placeholder: string;
  url: string;
  desc?: string;
  nullable?: boolean;
  valueAsNumber?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [query] = useDebounce(value, 300);

  const itemValue = form.getValues(name);
  const id = isNumber(itemValue) ? itemValue : "";

  const {
    data,
    isLoading,
    error,
  }: {
    data: Item[];
    isLoading: boolean;
    error: any;
  } = useSWR(`${url}?query=${query}&page=1&limit=10&id=${id}`, fetcher);

  if (error) console.log(error);

  const items = useMemo(() => {
    if (!data) return [];
    return data;
  }, [data]);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className='flex flex-col gap-1 space-y-0'>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant='secondary'
                  role='combobox'
                  className={cn(
                    "w-full justify-between rounded-full text-xs bg-[#F2F2F2]",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value
                    ? items?.find(
                        (item) =>
                          field.value ===
                          (valueAsNumber ? Number(item.value) : item.value)
                      )?.label
                    : placeholder}
                  {isLoading ? (
                    <Loader2 className='ml-2 h-4 w-4 shrink-0 opacity-50 animate-spin' />
                  ) : (
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                  )}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className='w-full p-0'>
              <Command shouldFilter={false}>
                <div className='relative'>
                  <CommandInput
                    className='text-xs'
                    placeholder='Поиск...'
                    value={value}
                    onValueChange={(v) => setValue(v)}
                  />
                  {isLoading && (
                    <div className='absolute top-1/2 right-3 transform -translate-y-1/2'>
                      <Loader2 className='h-4 w-4 animate-spin' />
                    </div>
                  )}
                </div>
                <CommandList className='max-h-[200px] overflow-y-auto scrollbar-hide'>
                  <CommandEmpty className='text-xs text-muted-foreground'>
                    Ничего не найдено.
                  </CommandEmpty>
                  <CommandGroup>
                    {items?.map((item) => (
                      <CommandItem
                        value={item.label}
                        key={item.value}
                        onSelect={() => {
                          const currentValue = form.getValues(name);
                          const newValue =
                            currentValue ===
                              (valueAsNumber
                                ? Number(item.value)
                                : item.value) && nullable
                              ? null
                              : valueAsNumber
                              ? Number(item.value)
                              : item.value;

                          form.setValue(name, newValue, {
                            shouldDirty: true,
                          });
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            item.value === field.value?.toString()
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        <div className='text-xs'>
                          {item.label}
                          {item?.desc && (
                            <p className='text-xs text-muted-foreground'>
                              {item.desc}
                            </p>
                          )}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {desc && (
            <FormDescription className='text-xs'>{desc}</FormDescription>
          )}
          <FormMessage className='text-xs' />
        </FormItem>
      )}
    />
  );
}

function isNumber(value: any): boolean {
  if (value === null || value === undefined || value === "") {
    return false;
  }
  if (typeof value === "number") {
    return !isNaN(value);
  }
  if (typeof value === "string") {
    return !isNaN(Number(value));
  }
  return false;
}
