import { Check, ChevronsUpDown } from "lucide-react";
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
import { useState } from "react";

export default function FormCombobox({
  form,
  name,
  placeholder,
  desc,
  items,
}: {
  form: any;
  name: string;
  placeholder: string;
  desc?: string;
  items: Array<{ value: string; label: string; desc?: string }>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className='flex flex-col gap-1'>
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
                    ? items.find((item) => item.value === field.value)?.label
                    : placeholder}
                  <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className='w-full p-0'>
              <Command>
                <CommandInput className='text-xs' placeholder='Поиск...' />
                <CommandList className='max-h-[200px] overflow-y-auto scrollbar-hide'>
                  <CommandEmpty className='text-xs text-muted-foreground'>
                    Ничего не найдено.
                  </CommandEmpty>
                  <CommandGroup>
                    {items.map((item) => (
                      <CommandItem
                        value={item.label}
                        key={item.value}
                        onSelect={() => {
                          form.setValue(name, item.value, {
                            shouldDirty: true,
                          });
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            item.value === field.value
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
