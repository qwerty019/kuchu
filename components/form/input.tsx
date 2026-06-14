import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

export function FormInput({
  form,
  name,
  placeholder,
  desc,
  disabled,
  type,
  ...props
}: {
  form: any;
  name: string;
  placeholder: string;
  desc?: string;
  disabled?: boolean;
  type?: string;
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className='w-full space-y-1'>
          <FormControl>
            <Input
              {...field}
              type={type}
              disabled={disabled}
              className='w-full rounded-full text-xs bg-[#F2F2F2] py-4 px-4 border-none'
              placeholder={placeholder}
              value={field.value ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                field.onChange(value || null, { shouldDirty: true });
              }}
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

export const CustomInput = ({
  form,
  label,
  name,
  desc,
}: {
  form: any;
  label: string;
  name: string;
  desc?: string;
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className='space-y-0'>
          <FormLabel className='text-xs text-muted-foreground'>
            {label}
          </FormLabel>
          <FormControl>
            <Input
              {...field}
              value={field.value ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                field.onChange(value || null, { shouldDirty: true });
              }}
              className='border-0 border-b rounded-none px-0 py-1 h-8 focus-visible:ring-0 focus-visible:border-primary'
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
};
