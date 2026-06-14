"use client";

import { forwardRef, useRef, useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { uploadToS3 } from "@/lib/upload";

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
  folder: string;
  fileName?: string;
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
              "w-full rounded-full text-xs bg-[#F2F2F2] py-4 pl-4 pr-11 border-none",
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
export function InputImageField<
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
  folder,
  fileName,
  ...props
}: InputFieldProps<TFieldValues, TName>) {
  const uploadRef = useRef<HTMLInputElement | null>(null);
  const [clicked, setClicked] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className='relative'>
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
          <Button
            size='icon'
            type='button'
            className='absolute top-1 right-1 w-8 h-8 rounded-full'
            disabled={disabled || clicked}
            onClick={() => {
              if (disabled || clicked) return;
              uploadRef.current?.click();
            }}
          >
            {clicked ? (
              <Loader2 className='w-3 h-3 animate-spin' />
            ) : (
              <Upload className='w-3 h-3' />
            )}
          </Button>
          <input
            ref={uploadRef}
            className='hidden w-0 h-0 opacity-0'
            type='file'
            accept='.jpeg, .jpg, .png, .gif'
            onClick={(e: React.MouseEvent<HTMLInputElement>) => {
              const inputElement = e.target as HTMLInputElement;
              inputElement.value = "";
            }}
            onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
              if (!e.target.files) return;
              if (e.target.files.length !== 1) return;
              if (disabled) return;

              const file = e.target.files[0];
              const fileExt = file.name.split(".").pop();

              if (!fileExt || !extensions.includes(fileExt)) {
                toast.error("Неверный формат изображения");
                return;
              }

              setClicked(true);

              try {
                const alterName = new Date().getTime();
                const formData = new FormData();
                formData.append("file", file);

                const uploadResult = await uploadToS3(
                  formData,
                  `${fileName || alterName}.${fileExt}`,
                  folder,
                  true,
                );

                setClicked(false);

                field.onChange(uploadResult.url, { shouldDirty: true });
              } catch (error: any) {
                console.log(error);
                setClicked(false);
                toast.error(error?.message || "Что-то пошло не так.");
              }
            }}
          />
        </div>
      )}
    />
  );
}

const extensions = ["jpeg", "jpg", "png", "gif"];
