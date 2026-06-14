import { Checkbox } from "../ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

export default function FormCheckbox({
  form,
  name,
  label,
  desc,
  ...props
}: {
  form: any;
  name: string;
  label: string;
  desc?: string;
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className='space-y-1'>
          <div className='flex flex-row items-center space-x-2 space-y-0 rounded-full bg-[#F2F2F2] px-4 h-10'>
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                className='rounded-full data-[state=checked]:bg-[#A03968] data-[state=checked]:border-[#A03968]'
                {...props}
              />
            </FormControl>
            <FormLabel className='text-xs font-normal leading-none'>
              {label}
            </FormLabel>
          </div>
          {desc && (
            <FormDescription className='text-xs'>{desc}</FormDescription>
          )}
          <FormMessage className='text-xs' />
        </FormItem>
      )}
    />
  );
}
