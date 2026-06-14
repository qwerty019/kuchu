import { DynamicForm } from "@/components/forms";
import { editGood } from "@/lib/db/good/actions";
import { EditGoodSchema, GoodAdmin } from "@/lib/db/good/schema";
import { Option } from "@/lib/definitions";

export function EditGood({
  open,
  setOpen,
  good,
  setGoods,
  categories,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  good: GoodAdmin;
  setGoods: React.Dispatch<React.SetStateAction<GoodAdmin[]>>;
  categories: Option[];
}) {
  return (
    <DynamicForm
      open={open}
      setOpen={setOpen}
      formSchema={EditGoodSchema}
      action={async (data) => {
        return await editGood(good.id, data);
      }}
      title='Редактировать товар'
      refreshOnSubmit={false}
      onSuccess={(result) => {
        // Check if result is the updated good data
        if (result && typeof result === "object" && "id" in result) {
          setGoods((prev) =>
            prev.map((x) => (x.id === result.id ? result : x))
          );
        }
      }}
      initialData={{
        categoryId: good.category?.id || null,
        img: good.img,
        title: good.title,
        subtitle: good.subtitle,
        isHidden: good.isHidden,
      }}
      buttonText='Сохранить'
      sections={[
        {
          type: "combobox",
          name: "categoryId",
          placeholder: "Категория",
          options: categories,
          nullable: true,
        },
        {
          type: "image",
          name: "img",
          placeholder: "Изображение",
          folder: "product",
          fileName: good.regId.toString(),
        },
        {
          type: "input",
          name: "title",
          placeholder: "Название",
          required: false,
        },
        {
          type: "input",
          name: "subtitle",
          placeholder: "Подзаголовок",
          required: false,
        },
        {
          name: "isHidden",
          label: "Скрыть товар",
          type: "checkbox",
        },
      ]}
    />
  );
}
