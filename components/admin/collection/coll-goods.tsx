"use client";

import { useEffect, useState } from "react";
import { reorderCollGoods } from "@/lib/db/collGood/actions";
import { toast } from "sonner";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DroppableProps,
  DropResult,
} from "react-beautiful-dnd";
import { CollectionWithGoods } from "@/lib/db/collection/schema";
import Empty from "@/components/ui/custom/empty";
import { CollGood } from "./coll-good";
import { AddCategory, AddGoods } from "./coll-good-actions";

export default function CollGoods({
  collection,
}: {
  collection: CollectionWithGoods;
}) {
  const [collGoods, setCollGoods] = useState(collection.collgoods);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCollGoods(collection.collgoods);
  }, [collection.collgoods]);

  const onDragEnd = async (result: DropResult) => {
    if (
      !result.destination ||
      result.source.index === result.destination.index
    ) {
      return;
    }

    if (loading) return;

    const initial = [...collGoods];

    const reordered = reorder(
      collGoods,
      result.source.index,
      result.destination.index
    );

    setCollGoods(reordered);

    const withPositions = reordered.map((item, index) => ({
      id: item.id,
      position: index + 1,
    }));

    setLoading(true);

    const action = await reorderCollGoods({
      collGoods: withPositions,
    });

    if (action && "message" in action) {
      toast.error(action.message);
      setCollGoods(initial);
    }

    setLoading(false);
  };

  if (collGoods.length === 0) return <Empty message='Нет товаров' />;

  return (
    <>
      <div className='flex items-center gap-1 flex-wrap'>
        <AddCategory collectionId={collection.id} />
        <AddGoods collectionId={collection.id} />
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <StrictModeDroppable droppableId='droppable'>
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className='border rounded-xl'
            >
              {collGoods.map((cg, index) => (
                <Draggable
                  key={cg.id.toString()}
                  draggableId={cg.id.toString()}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <CollGood
                      key={cg.id.toString()}
                      collGood={cg}
                      index={index}
                      setCollGoods={setCollGoods}
                      provided={provided}
                      snapshot={snapshot}
                      loading={loading}
                    />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </StrictModeDroppable>
      </DragDropContext>
    </>
  );
}

const reorder = (
  list: CollectionWithGoods["collgoods"],
  startIndex: number,
  endIndex: number
) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const StrictModeDroppable = ({ children, ...props }: DroppableProps) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return <Droppable {...props}>{children}</Droppable>;
};
