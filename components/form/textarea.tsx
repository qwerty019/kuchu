import { cn } from "@/lib/utils";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";

export default function FormTextArea({
  form,
  name,
  placeholder,
  desc,
  disabled,
  className,
  ...props
}: {
  form: any;
  name: string;
  placeholder: string;
  desc?: string;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Textarea
              {...field}
              disabled={disabled}
              placeholder={placeholder}
              value={field.value ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                field.onChange(value || null, { shouldDirty: true });
              }}
              className={cn(
                "px-4 py-3 rounded-2xl text-xs bg-[#F2F2F2] border-none",
                className
              )}
              {...props}
            />
          </FormControl>
          {desc && (
            <FormDescription className='text-xs'>{desc}</FormDescription>
          )}
          <FormMessage className='text-xs' />
        </FormItem>
      )}
    />
  );
}
