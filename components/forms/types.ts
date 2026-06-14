import { z } from "zod";
import { Option } from "@/lib/definitions";

export type FieldType =
  | "input"
  | "select"
  | "textarea"
  | "checkbox"
  | "combobox"
  | "multi"
  | "image";

export type DataFetcher<T = Option[]> = () => Promise<T>;

export interface BaseFieldConfig {
  name: string;
  label?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export interface InputFieldConfig extends BaseFieldConfig {
  type: "input";
  inputType?:
    | "text"
    | "email"
    | "password"
    | "tel"
    | "url"
    | "number"
    | "date"
    | "datetime-local"
    | "time";
  placeholder?: string;
}

export interface SelectFieldConfig extends BaseFieldConfig {
  type: "select";
  options?: Option[];
  dataFetcher?: DataFetcher<Option[]>;
  nullable?: boolean;
  placeholder?: string;
}

export interface TextareaFieldConfig extends BaseFieldConfig {
  type: "textarea";
  placeholder?: string;
  rows?: number;
}

export interface CheckboxFieldConfig extends BaseFieldConfig {
  type: "checkbox";
}

export interface ComboboxFieldConfig extends BaseFieldConfig {
  type: "combobox";
  options?: Option[];
  dataFetcher?: DataFetcher<Option[]>;
  nullable?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
}

export interface MultiFieldConfig extends BaseFieldConfig {
  type: "multi";
  options?: Option[];
  dataFetcher?: DataFetcher<Option[]>;
  nullable?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
}

export interface ImageFieldConfig extends BaseFieldConfig {
  type: "image";
  folder: string;
  placeholder?: string;
  fileName?: string;
  disabled?: boolean;
}

export type FieldConfig =
  | InputFieldConfig
  | SelectFieldConfig
  | TextareaFieldConfig
  | CheckboxFieldConfig
  | ComboboxFieldConfig
  | MultiFieldConfig
  | ImageFieldConfig;

export type FormSection = FieldConfig;

export type FormData<T extends z.ZodRawShape> = z.infer<z.ZodObject<T>>;
