"use client";

import { forwardRef } from "react";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";

export interface BasicTextareaFieldProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  description?: string;
  error?: string | string[];
  required?: boolean;
}

// React Hook Form Controller version
export interface TextareaFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<BasicTextareaFieldProps, "value" | "onChange" | "name"> {
  name: TName;
  control: Control<TFieldValues>;
}

export const BasicTextareaField = forwardRef<
  HTMLTextAreaElement,
  BasicTextareaFieldProps
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
          <Textarea
            ref={ref}
            className={cn(
              "px-4 py-3 rounded-2xl text-xs bg-[#F2F2F2] border-none",
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

BasicTextareaField.displayName = "BasicTextareaField";

// Controlled version using React Hook Form Controller
export function TextareaField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  label,
  description,
  required,
  placeholder,
  rows,
  disabled,
  id,
  className,
  ...props
}: TextareaFieldProps<TFieldValues, TName>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <BasicTextareaField
          {...field}
          id={id || name}
          label={label}
          description={description}
          placeholder={placeholder}
          rows={rows}
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
