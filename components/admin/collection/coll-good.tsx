"use client";

import { Button } from "@/components/ui/button";
import { CollectionWithGoods } from "@/lib/db/collection/schema";
import { deleteCollGood } from "@/lib/db/collGood/actions";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  DraggableProvided,
  DraggableStateSnapshot,
  DraggingStyle,
  NotDraggingStyle,
} from "react-beautiful-dnd";
import { toast } from "sonner";

export function CollGood({
  collGood,
  setCollGoods,
  provided,
  snapshot,
  index,
  loading,
}: {
  collGood: CollectionWithGoods["collgoods"][number];
  setCollGoods: React.Dispatch<
    React.SetStateAction<CollectionWithGoods["collgoods"]>
  >;
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
  index: number;
  loading: boolean;
}) {
  const [clicked, setClicked] = useState(false);

  const handleDelete = async (
    collGood: CollectionWithGoods["collgoods"][number]
  ) => {
    if (clicked) return;

    const confirm = window.confirm(
      `Вы уверены, что хотите удалить товар "${collGood.good.drug}"?`
    );

    if (!confirm) return;

    setClicked(true);

    const action = await deleteCollGood(collGood.id);

    if (action && "message" in action) {
      setClicked(false);
      toast.error(action.message);
      return;
    }

    setClicked(false);
    setCollGoods((prev) => prev.filter((x) => x.id !== collGood.id));
  };

  return (
    <div
      className='flex items-center justify-between gap-2 p-2 border-b last:border-none'
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
    >
      <div className='flex items-center gap-2'>
        <p className='text-xs text-muted-foreground px-1'>{index + 1}</p>
        <div>
          <p className='text-sm'>{collGood.good.drug}</p>
          <p className='text-xs text-muted-foreground'>{collGood.good.form}</p>
          <p className='text-xs text-muted-foreground'>
            {loading
              ? "Подождите..."
              : collGood.good.category?.title || "Без категории"}
          </p>
        </div>
      </div>
      <Button
        variant='outline'
        size='icon'
        className='rounded-xl w-8 h-8 shrink-0 text-muted-foreground'
        onClick={() => handleDelete(collGood)}
        disabled={clicked || loading}
      >
        {clicked ? (
          <Loader2 className='w-4 h-4 animate-spin' />
        ) : (
          <Trash2 className='w-4 h-4' />
        )}
      </Button>
    </div>
  );
}

const getItemStyle = (
  isDragging: boolean,
  draggableStyle: DraggingStyle | NotDraggingStyle | undefined
) => ({
  opacity: isDragging ? 0.5 : 1,
  ...draggableStyle,
});
