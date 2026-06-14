"use client";

import { forwardRef } from "react";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";

export interface BasicInputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string | string[];
  required?: boolean;
}

// React Hook Form Controller version
export interface InputFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<BasicInputFieldProps, "value" | "onChange" | "name"> {
  name: TName;
  control: Control<TFieldValues>;
}

export const BasicInputField = forwardRef<
  HTMLInputElement,
  BasicInputFieldProps
>(
  (
    {
      label,
      description,
      error,
      required,
      className,
      value,
      onChange,
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
      <Field>
        <FieldContent>
          {label && (
            <FieldLabel
              htmlFor={props.id}
              className={
                required
                  ? "after:content-['*'] after:text-destructive after:ml-1"
                  : ""
              }
            >
              {label}
            </FieldLabel>
          )}
          <Input
            ref={ref}
            className={cn(
              "w-full rounded-full text-xs bg-[#F2F2F2] py-4 px-4 border-none",
              className
            )}
            value={value ?? ""}
            onChange={onChange}
            {...props}
          />
          {description && <FieldDescription>{description}</FieldDescription>}
          <FieldError errors={errors} className='text-xs' />
        </FieldContent>
      </Field>
    );
  }
);

BasicInputField.displayName = "BasicInputField";

// Controlled version using React Hook Form Controller
export function InputField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  label,
  description,
  required,
  type,
  placeholder,
  disabled,
  id,
  className,
  ...props
}: InputFieldProps<TFieldValues, TName>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <BasicInputField
          {...field}
          id={id || name}
          label={label}
          description={description}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          error={fieldState.error?.message}
          className={className}
          onChange={(e) => {
            const value = e.target.value;
            field.onChange(value || null, { shouldDirty: true });
          }}
          {...props}
        />
      )}
    />
  );
}
