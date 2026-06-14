"use client";

import { useState, useEffect, useTransition, useMemo } from "react";
import { useForm, FieldPath, DefaultValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldSet } from "@/components/ui/field";
import {
  InputField,
  SelectField,
  TextareaField,
  CheckboxField,
  ComboboxField,
  MultiField,
} from "./fields";

// Re-export field components for use in custom renderForm functions
export {
  InputField,
  SelectField,
  TextareaField,
  CheckboxField,
  ComboboxField,
} from "./fields";
import {
  FormData,
  FieldConfig,
  InputFieldConfig,
  SelectFieldConfig,
  TextareaFieldConfig,
  ComboboxFieldConfig,
  FormSection,
  MultiFieldConfig,
  ImageFieldConfig,
} from "./types";
import { toast } from "sonner";
import { useRouterRefresh } from "@/hooks/use-router-refresh";
import Dialog from "../ui/custom/dialog";
import { Loader2, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { InputImageField } from "./fields/input-image-field";

type DynamicFormProps<T extends z.ZodRawShape> = {
  formSchema: z.ZodObject<T> | z.ZodEffects<z.ZodObject<T>>;
  action: (
    data: FormData<T>
  ) => Promise<
    | void
    | { success: boolean }
    | { message: string; errors?: Record<string, string[]> }
    | any
  >;
  deleteAction?: () => Promise<
    void | { success: boolean } | { message: string }
  >;
  initialData?: Partial<FormData<T>>;
  initialDataFetcher?: () => Promise<Partial<FormData<T>>>;
  isLoading?: boolean;
  className?: string;
  noDialog?: boolean;
  trigger?: React.ReactNode;
  title?: string;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  buttonText?: string;
  deleteConfirmTitle?: string;
  deleteConfirmDescription?: string;
  refreshOnSubmit?: boolean;
  onSuccess?: (result: any) => void;
} & (
  | {
      sections: FormSection[];
      renderForm?: never;
    }
  | {
      sections?: never;
      renderForm: ({
        form,
        isLoading,
        isSubmitting,
        initial,
      }: {
        form: ReturnType<typeof useForm<FormData<T>>>;
        isLoading: boolean;
        isSubmitting: boolean;
        initial: Partial<FormData<T>>;
      }) => React.ReactNode;
    }
);

export function renderField<T extends z.ZodRawShape>(
  field: FieldConfig,
  form: ReturnType<typeof useForm<FormData<T>>>,
  isLoading: boolean,
  isSubmitting: boolean,
  dynamicOptions: Record<string, any[]> = {},
  loadingFields: Set<string> = new Set(),
  isPending: boolean = false
) {
  switch (field.type) {
    case "input": {
      const inputField = field as InputFieldConfig;
      return (
        <InputField
          key={field.name}
          name={field.name as FieldPath<FormData<T>>}
          control={form.control}
          label={field.label}
          description={field.description}
          required={field.required}
          disabled={field.disabled || isLoading || isSubmitting}
          type={inputField.inputType || "text"}
          placeholder={inputField.placeholder}
        />
      );
    }

    case "select": {
      const selectField = field as SelectFieldConfig;
      const fieldLoading = loadingFields.has(field.name) || isPending;
      const options = selectField.dataFetcher
        ? dynamicOptions[field.name] || []
        : selectField.options || [];

      return (
        <SelectField
          key={field.name}
          name={field.name as FieldPath<FormData<T>>}
          control={form.control}
          label={field.label}
          description={field.description}
          required={field.required}
          disabled={field.disabled || isLoading || isSubmitting || fieldLoading}
          options={options}
          placeholder={fieldLoading ? "Загрузка..." : selectField.placeholder}
          nullable={selectField.nullable}
        />
      );
    }

    case "textarea": {
      const textareaField = field as TextareaFieldConfig;
      return (
        <TextareaField
          key={field.name}
          name={field.name as FieldPath<FormData<T>>}
          control={form.control}
          label={field.label}
          description={field.description}
          required={field.required}
          disabled={field.disabled || isLoading || isSubmitting}
          placeholder={textareaField.placeholder}
          rows={textareaField.rows || 4}
          className='resize-none'
        />
      );
    }

    case "checkbox": {
      return (
        <CheckboxField
          key={field.name}
          name={field.name as FieldPath<FormData<T>>}
          control={form.control}
          label={field.label}
          description={field.description}
          required={field.required}
          disabled={field.disabled || isLoading || isSubmitting}
        />
      );
    }

    case "combobox": {
      const comboboxField = field as ComboboxFieldConfig;
      const fieldLoading = loadingFields.has(field.name) || isPending;
      const options = comboboxField.dataFetcher
        ? dynamicOptions[field.name] || []
        : comboboxField.options || [];

      return (
        <ComboboxField
          key={field.name}
          name={field.name as FieldPath<FormData<T>>}
          control={form.control}
          label={field.label}
          description={field.description}
          required={field.required}
          disabled={field.disabled || isLoading || isSubmitting || fieldLoading}
          options={options}
          placeholder={fieldLoading ? "Загрузка..." : comboboxField.placeholder}
          searchPlaceholder={comboboxField.searchPlaceholder}
          emptyMessage={comboboxField.emptyMessage}
        />
      );
    }

    case "multi": {
      const multiField = field as MultiFieldConfig;
      const fieldLoading = loadingFields.has(field.name) || isPending;
      const options = multiField.dataFetcher
        ? dynamicOptions[field.name] || []
        : multiField.options || [];

      return (
        <MultiField
          key={field.name}
          name={field.name as FieldPath<FormData<T>>}
          control={form.control}
          label={field.label}
          description={field.description}
          required={field.required}
          disabled={field.disabled || isLoading || isSubmitting || fieldLoading}
          options={options}
          placeholder={fieldLoading ? "Загрузка..." : multiField.placeholder}
          searchPlaceholder={multiField.searchPlaceholder}
          emptyMessage={multiField.emptyMessage}
        />
      );
    }

    case "image": {
      const imageField = field as ImageFieldConfig;
      return (
        <InputImageField
          key={field.name}
          name={field.name as FieldPath<FormData<T>>}
          control={form.control}
          label={field.label}
          description={field.description}
          required={field.required}
          disabled={field.disabled || isLoading || isSubmitting}
          type='text'
          placeholder={imageField.placeholder}
          folder={imageField.folder}
          fileName={imageField.fileName}
        />
      );
    }

    default:
      return null;
  }
}

// Example usage with renderForm:
// <DynamicForm
//   formSchema={mySchema}
//   renderForm={(form, isLoading, isSubmitting) => (
//     <div className="space-y-4">
//       <div className="grid grid-cols-2 gap-4">
//         <InputField name="firstName" control={form.control} label="First Name" />
//         <InputField name="lastName" control={form.control} label="Last Name" />
//       </div>
//       <TextareaField name="description" control={form.control} label="Description" />
//     </div>
//   )}
//   action={handleSubmit}
// />

export function DynamicForm<T extends z.ZodRawShape>({
  formSchema,
  sections,
  renderForm,
  initialData,
  initialDataFetcher,
  isLoading = false,
  className = "w-full",
  action,
  deleteAction,
  noDialog = false,
  title,
  trigger,
  open: externalOpen,
  setOpen: externalSetOpen,
  buttonText,
  deleteConfirmTitle,
  deleteConfirmDescription,
  refreshOnSubmit = true,
  onSuccess,
}: DynamicFormProps<T>) {
  // Validate that either sections or renderForm is provided
  if (!sections && !renderForm) {
    throw new Error("Either sections or renderForm must be provided");
  }
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [dynamicOptions, setDynamicOptions] = useState<Record<string, any[]>>(
    {}
  );
  const [loadingFields, setLoadingFields] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();
  const [internalOpen, setInternalOpen] = useState(false);
  const [fetchedInitialData, setFetchedInitialData] = useState<Partial<
    FormData<T>
  > | null>(null);
  const [isLoadingInitialData, setIsLoadingInitialData] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = externalSetOpen || setInternalOpen;

  const refresh = useRouterRefresh();

  // Fetch initial data when component mounts or dialog opens
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!initialDataFetcher) return;

      setIsLoadingInitialData(true);
      try {
        const data = await initialDataFetcher();
        setFetchedInitialData(data);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast.error("Не удалось загрузить данные для редактирования");
      } finally {
        setIsLoadingInitialData(false);
      }
    };

    // Fetch initial data when dialog opens or when not using dialog
    if (noDialog || open) {
      fetchInitialData();
    }
  }, [initialDataFetcher, open, noDialog]);

  // Fetch external data for fields with dataFetcher (only when using sections)
  useEffect(() => {
    if (!sections) return;

    const fetchFieldData = () => {
      const fieldsWithFetchers = sections.filter(
        (field) =>
          (field.type === "select" || field.type === "combobox") &&
          (field as SelectFieldConfig | ComboboxFieldConfig).dataFetcher
      );

      if (fieldsWithFetchers.length === 0) return;

      // Set loading state for fields that need data
      setLoadingFields(new Set(fieldsWithFetchers.map((field) => field.name)));

      startTransition(() => {
        (async () => {
          try {
            const fetchPromises = fieldsWithFetchers.map(async (field) => {
              const fieldWithFetcher = field as
                | SelectFieldConfig
                | ComboboxFieldConfig;
              if (fieldWithFetcher.dataFetcher) {
                const options = await fieldWithFetcher.dataFetcher();
                return { fieldName: field.name, options };
              }
              return null;
            });

            const results = await Promise.all(fetchPromises);

            const newDynamicOptions: Record<string, any[]> = {};
            results.forEach((result) => {
              if (result) {
                newDynamicOptions[result.fieldName] = result.options;
              }
            });

            setDynamicOptions(newDynamicOptions);
          } catch (error) {
            console.error("Error fetching field data:", error);
            toast.error("Не удалось загрузить данные для полей");
          } finally {
            setLoadingFields(new Set());
          }
        })();
      });
    };

    // Only fetch when dialog opens or when not using dialog
    if (noDialog || open) {
      fetchFieldData();
    }
  }, [sections, open, noDialog]);

  // Combine static initial data with fetched initial data
  const combinedInitialData = useMemo(
    () =>
      ({
        ...initialData,
        ...fetchedInitialData,
      }) as DefaultValues<FormData<T>>,
    [initialData, fetchedInitialData]
  );

  const form = useForm<FormData<T>>({
    resolver: zodResolver(formSchema),
    defaultValues: combinedInitialData,
  });

  // Reset form when fetched initial data changes
  useEffect(() => {
    if (fetchedInitialData) {
      form.reset(combinedInitialData);
    }
  }, [fetchedInitialData, form, combinedInitialData]);

  const handleSubmit = form.handleSubmit(async (data) => {
    setIsSubmitting(true);

    try {
      const result = await action(data as FormData<T>);

      // Check if result is an error response
      if (
        typeof result === "object" &&
        result !== null &&
        "message" in result
      ) {
        if ("errors" in result && result.errors) {
          Object.entries(result.errors).forEach(([key, value]) => {
            form.setError(key as FieldPath<FormData<T>>, {
              message: Array.isArray(value) ? value[0] : String(value),
            });
          });
        }

        throw new Error(result.message);
      }

      // If we get here, the action was successful
      form.reset(data as FormData<T>);

      if (refreshOnSubmit) {
        await refresh();
      }

      // Pass the result (which could be the updated data or undefined/void) to onSuccess
      if (onSuccess) {
        onSuccess(result);
      }

      setOpen(false);
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Что-то пошло не так");
      }
    } finally {
      setIsSubmitting(false);
    }
  });

  const handleDelete = async () => {
    if (!deleteAction) return;

    setIsDeleting(true);
    setErrorMessage(null);

    try {
      const result = await deleteAction();
      if (typeof result === "object" && "message" in result) {
        throw new Error(result.message);
      }

      await refresh();
      toast.success("Успешно удалено");
      setOpen(false);
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Не удалось удалить");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DialogWrapper
      className={className}
      noDialog={noDialog}
      title={title}
      trigger={trigger}
      open={open}
      setOpen={setOpen}
    >
      <form onSubmit={handleSubmit} className='space-y-6'>
        {renderForm ? (
          renderForm({
            form,
            isLoading,
            isSubmitting,
            initial: combinedInitialData,
          })
        ) : (
          <FieldGroup className='gap-2'>
            {sections!.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                <FieldSet>
                  <FieldGroup>
                    {renderField<T>(
                      section,
                      form,
                      isLoading,
                      isSubmitting,
                      dynamicOptions,
                      loadingFields,
                      isPending
                    )}
                  </FieldGroup>
                </FieldSet>
              </div>
            ))}
          </FieldGroup>
        )}
        <FieldGroup>
          <Field
            orientation='horizontal'
            className='w-full flex items-center justify-between'
          >
            {deleteAction && (
              <DeleteDialog
                isLoading={isLoading}
                isSubmitting={isSubmitting}
                isDeleting={isDeleting}
                loadingFields={loadingFields}
                isPending={isPending}
                isLoadingInitialData={isLoadingInitialData}
                deleteConfirmTitle={deleteConfirmTitle}
                deleteConfirmDescription={deleteConfirmDescription}
                handleDelete={handleDelete}
                message={errorMessage}
              />
            )}
            <Button
              type='submit'
              disabled={
                isLoading ||
                isSubmitting ||
                isDeleting ||
                loadingFields.size > 0 ||
                isPending ||
                isLoadingInitialData ||
                !form.formState.isDirty
              }
              className='ml-auto rounded-full bg-[#A03968] hover:bg-[#A03968] p-4 text-xs gap-2'
            >
              {isSubmitting ? (
                <>
                  <Loader2 className='w-4 h-4 animate-spin' />
                  Подождите...
                </>
              ) : isLoadingInitialData ? (
                <>
                  <Loader2 className='w-4 h-4 animate-spin' />
                  Загрузка данных...
                </>
              ) : loadingFields.size > 0 || isPending ? (
                <>
                  <Loader2 className='w-4 h-4 animate-spin' />
                  Загрузка опций...
                </>
              ) : (
                buttonText || "Создать"
              )}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </DialogWrapper>
  );
}

function DialogWrapper({
  children,
  title,
  noDialog = false,
  className,
  trigger,
  open,
  setOpen,
}: {
  children: React.ReactNode;
  title?: string;
  noDialog?: boolean;
  className?: string;
  trigger?: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  if (noDialog) {
    return <div className={className}>{children}</div>;
  }

  return (
    <Dialog
      title={title || "Диалог"}
      className={className}
      trigger={trigger}
      open={open}
      setOpen={setOpen}
    >
      {children}
    </Dialog>
  );
}

function DeleteDialog({
  isLoading,
  isSubmitting,
  isDeleting,
  loadingFields,
  isPending,
  isLoadingInitialData,
  deleteConfirmTitle,
  deleteConfirmDescription,
  handleDelete,
  message,
}: {
  isLoading: boolean;
  isSubmitting: boolean;
  isDeleting: boolean;
  loadingFields: Set<string>;
  isPending: boolean;
  isLoadingInitialData: boolean;
  deleteConfirmTitle: string | undefined;
  deleteConfirmDescription: string | undefined;
  handleDelete: () => void;
  message?: string | null;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type='button'
          variant='destructive'
          disabled={
            isLoading ||
            isSubmitting ||
            isDeleting ||
            loadingFields.size > 0 ||
            isPending ||
            isLoadingInitialData
          }
          className='rounded-full p-4 text-xs'
        >
          {isDeleting ? (
            <Loader2 className='w-4 h-4 animate-spin' />
          ) : (
            <Trash2 className='w-4 h-4' />
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className='sm:rounded-2xl'>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {deleteConfirmTitle || "Подтвердите удаление"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {deleteConfirmDescription ||
              "Это действие нельзя отменить. Данные будут удалены навсегда."}
          </AlertDialogDescription>
          {message && (
            <AlertDialogDescription className='text-destructive'>
              {message}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter className='sm:space-x-1'>
          <AlertDialogCancel className='rounded-full p-4 text-xs'>
            Отмена
          </AlertDialogCancel>
          <Button
            type='button'
            variant='destructive'
            onClick={handleDelete}
            disabled={isDeleting}
            className='rounded-full bg-[#A03968] hover:bg-[#A03968] p-4 text-xs'
          >
            {isDeleting ? (
              <>
                <Loader2 className='w-4 h-4 animate-spin mr-2' />
                Удаление...
              </>
            ) : (
              "Удалить"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
