"use client";

import { forwardRef } from "react";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { Option } from "@/lib/definitions";

export interface BasicSelectFieldProps {
  label?: string;
  description?: string;
  error?: string | string[];
  required?: boolean;
  placeholder?: string;
  options: Option[];
  value?: string | null;
  onValueChange?: (value: string | null) => void;
  disabled?: boolean;
  id?: string;
  nullable?: boolean;
  emptyMessage?: string;
}

// React Hook Form Controller version
export interface SelectFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<BasicSelectFieldProps, "value" | "onValueChange"> {
  name: TName;
  control: Control<TFieldValues>;
}

export const BasicSelectField = forwardRef<
  HTMLButtonElement,
  BasicSelectFieldProps
>(
  (
    {
      label,
      description,
      error,
      required,
      placeholder = "Выберите опцию...",
      options,
      value,
      onValueChange,
      disabled,
      id,
      nullable,
      emptyMessage = "Нет данных",
    },
    ref
  ) => {
    const errorArray = Array.isArray(error)
      ? error
      : error
        ? [error]
        : undefined;
    const errors = errorArray?.map((msg) => ({ message: msg }));

    const handleValueChange = (selectedValue: string) => {
      if (nullable && selectedValue === value) {
        // If nullable and same value selected, clear the selection
        onValueChange?.(null);
      } else {
        onValueChange?.(selectedValue);
      }
    };

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
          <Select
            value={value ?? ""}
            onValueChange={handleValueChange}
            disabled={disabled}
          >
            <SelectTrigger
              id={id}
              ref={ref}
              className={cn(
                "bg-[#F2F2F2] rounded-full text-xs border-none px-4",
                !value && "text-muted-foreground"
              )}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.length === 0 && (
                <SelectItem value='no-data' disabled>
                  {emptyMessage}
                </SelectItem>
              )}
              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  <div className='flex flex-col flex-1 text-xs'>
                    <span>{option.label}</span>
                    {option.desc && (
                      <span className='text-muted-foreground'>
                        {option.desc}
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && <FieldDescription>{description}</FieldDescription>}
          <FieldError errors={errors} className='text-xs' />
        </FieldContent>
      </Field>
    );
  }
);

BasicSelectField.displayName = "BasicSelectField";

// Controlled version using React Hook Form Controller
export function SelectField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  label,
  description,
  required,
  placeholder = "Select an option",
  options,
  disabled,
  id,
  nullable,
  ...props
}: SelectFieldProps<TFieldValues, TName>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <BasicSelectField
          id={id || name}
          label={label}
          description={description}
          placeholder={placeholder}
          options={options}
          disabled={disabled}
          required={required}
          nullable={nullable}
          error={fieldState.error?.message}
          value={field.value}
          onValueChange={field.onChange}
          {...props}
        />
      )}
    />
  );
}
