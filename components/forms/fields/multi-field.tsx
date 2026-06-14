"use client";

import { forwardRef, useState } from "react";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { Option } from "@/lib/definitions";

export interface BasicMultiFieldProps {
  label?: string;
  description?: string;
  error?: string | string[];
  required?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  options: Option[];
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  id?: string;
  className?: string;
  nullable?: boolean;
}

// React Hook Form Controller version
export interface MultiFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<BasicMultiFieldProps, "value" | "onValueChange"> {
  name: TName;
  control: Control<TFieldValues>;
}

export const BasicMultiField = forwardRef<
  HTMLButtonElement,
  BasicMultiFieldProps
>(
  (
    {
      label,
      description,
      error,
      required,
      placeholder = "Выберите опцию...",
      searchPlaceholder = "Поиск...",
      emptyMessage = "Ничего не найдено.",
      options,
      value,
      onValueChange,
      disabled,
      id,
      className,
      nullable,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const errorArray = Array.isArray(error)
      ? error
      : error
        ? [error]
        : undefined;
    const errors = errorArray?.map((msg) => ({ message: msg }));

    const selected =
      value && value.length > 0
        ? options.filter((option) => value.includes(option.value))
        : [];

    return (
      <Field>
        <FieldContent>
          {label && (
            <FieldLabel
              htmlFor={id}
              className={
                required
                  ? "after:content-['*'] after:text-destructive after:ml-1"
                  : ""
              }
            >
              {label}
            </FieldLabel>
          )}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                ref={ref}
                id={id}
                variant='outline'
                role='combobox'
                aria-expanded={open}
                className={cn(
                  "font-normal w-full justify-between rounded-full text-xs bg-[#F2F2F2] border-none",
                  !value?.length && "text-muted-foreground",
                  className
                )}
                disabled={disabled}
                {...props}
              >
                <span className='truncate'>
                  {selected.length === 0
                    ? placeholder
                    : `${selected.length} выбрано`}
                </span>
                <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-full p-0' align='start'>
              <Command
                filter={(v, s) => {
                  const option = options.find((o) => o.value === v);
                  if (!option) return 0;
                  if (option.label.toLowerCase().includes(s.toLowerCase())) {
                    return 1;
                  }
                  return 0;
                }}
              >
                <CommandInput
                  className='text-xs'
                  placeholder={searchPlaceholder}
                />
                <CommandList className='max-h-[200px] w-full max-w-[336px] overflow-y-auto'>
                  <CommandEmpty className='text-xs text-muted-foreground'>
                    {emptyMessage}
                  </CommandEmpty>
                  <CommandGroup>
                    {options.map((option) => (
                      <CommandItem
                        key={option.value}
                        value={option.value}
                        disabled={option.disabled}
                        onSelect={(v) => {
                          onValueChange?.(v);
                          setOpen(false);
                        }}
                        className='gap-2'
                      >
                        <Check
                          className={cn(
                            "h-4 w-4",
                            selected.some((s) => s.value === option.value)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        <div className='flex flex-col flex-1 text-xs'>
                          <span>{option.label}</span>
                          {option.desc && (
                            <span className='text-muted-foreground'>
                              {option.desc}
                            </span>
                          )}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {description && <FieldDescription>{description}</FieldDescription>}
          <FieldError errors={errors} className='text-xs' />
        </FieldContent>
      </Field>
    );
  }
);

BasicMultiField.displayName = "BasicMultiField";

// Controlled version using React Hook Form Controller
export function MultiField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  label,
  description,
  required,
  placeholder = "Выберите опцию...",
  searchPlaceholder = "Поиск...",
  emptyMessage = "Ничего не найдено.",
  options,
  disabled,
  id,
  className,
  ...props
}: MultiFieldProps<TFieldValues, TName>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <BasicMultiField
          id={id || name}
          label={label}
          description={description}
          placeholder={placeholder}
          searchPlaceholder={searchPlaceholder}
          emptyMessage={emptyMessage}
          options={options}
          disabled={disabled}
          required={required}
          error={fieldState.error?.message}
          value={field.value?.map((x: string) => x.toString()) || []}
          onValueChange={(value) => {
            const newValue = field.value.includes(value)
              ? field.value.filter((v: string) => v !== value)
              : [...field.value, value];
            field.onChange(newValue, { shouldDirty: true });
          }}
          className={className}
          {...props}
        />
      )}
    />
  );
}
