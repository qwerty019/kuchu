import { cn } from "@/lib/utils";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FormSelect({
  form,
  name,
  desc,
  items,
  placeholder,
  valueAsNumber,
  nullable,
}: {
  form: any;
  name: string;
  desc?: string;
  items: Array<{ value: string; label: string }>;
  placeholder?: string;
  nullable?: boolean;
  valueAsNumber?: boolean;
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className='w-full space-y-1'>
          <Select
            onValueChange={(value) => {
              if (nullable && value === field.value?.toString()) {
                field.onChange(null);
                return;
              }
              field.onChange(valueAsNumber ? Number(value) : value);
            }}
            value={field.value?.toString() || ""}
          >
            <FormControl>
              <SelectTrigger
                className={cn(
                  "bg-[#F2F2F2] rounded-full text-xs border-none px-4",
                  !field.value && "text-muted-foreground"
                )}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {items.map((item, i) => (
                <SelectItem
                  key={i}
                  value={item.value}
                  className='text-xs'
                  // onPointerDown={(e) => {
                  //   e.preventDefault();
                  //   e.stopPropagation();

                  //   if (nullable && item.value === field.value?.toString()) {
                  //     field.onChange(null);
                  //     return;
                  //   }

                  //   field.onChange(
                  //     valueAsNumber ? Number(item.value) : item.value
                  //   );
                  // }}
                >
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {desc && (
            <FormDescription className='text-xs'>{desc}</FormDescription>
          )}
          <FormMessage className='text-xs' />
        </FormItem>
      )}
    />
  );
}
