"use client";

import { forwardRef } from "react";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

export interface BasicCheckboxFieldProps {
  label?: string;
  description?: string;
  error?: string | string[];
  required?: boolean;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
}

// React Hook Form Controller version
export interface CheckboxFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<BasicCheckboxFieldProps, "checked" | "onCheckedChange"> {
  name: TName;
  control: Control<TFieldValues>;
}

export const BasicCheckboxField = forwardRef<
  React.ElementRef<typeof Checkbox>,
  BasicCheckboxFieldProps
>(
  (
    {
      label,
      description,
      error,
      required,
      checked,
      onCheckedChange,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const errorArray = Array.isArray(error)
      ? error
      : error
        ? [error]
        : undefined;
    const errors = errorArray?.map((msg) => ({ message: msg }));

    return (
      <Field
        orientation='horizontal'
        className='flex flex-row gap-2 items-center rounded-full bg-[#F2F2F2] px-4 h-10'
      >
        <Checkbox
          id={id}
          ref={ref}
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          className='rounded-full'
          {...props}
        />
        <FieldContent>
          <FieldLabel
            htmlFor={id}
            className={`font-normal text-xs gap-1 cursor-pointer ${
              required ? "after:content-['*'] after:text-destructive" : ""
            }`}
          >
            {label}
          </FieldLabel>
          {description && <FieldDescription>{description}</FieldDescription>}
          <FieldError errors={errors} className='text-xs' />
        </FieldContent>
      </Field>
    );
  }
);

BasicCheckboxField.displayName = "BasicCheckboxField";

// Controlled version using React Hook Form Controller
export function CheckboxField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  label,
  description,
  required,
  disabled,
  id,
  ...props
}: CheckboxFieldProps<TFieldValues, TName>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <BasicCheckboxField
          {...props}
          id={id || name}
          label={label}
          description={description}
          disabled={disabled}
          required={required}
          checked={field.value}
          onCheckedChange={field.onChange}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}
