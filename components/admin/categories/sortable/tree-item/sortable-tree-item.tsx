import React, { CSSProperties } from "react";
import type { UniqueIdentifier } from "@dnd-kit/core";
import { AnimateLayoutChanges, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TreeItem, Props as TreeItemProps } from "./tree-item";
import { isAppleDevice } from "../utilities";
import { Option } from "@/lib/definitions";

interface Props extends TreeItemProps {
  id: UniqueIdentifier;
  title: string;
  route: string;
  categories: Option[];
  clicked: boolean;
}

const animateLayoutChanges: AnimateLayoutChanges = ({
  isSorting,
  wasDragging,
}) => (isSorting || wasDragging ? false : true);

export function SortableTreeItem({
  id,
  depth,
  categories,
  title,
  route,
  clicked,
  ...props
}: Props) {
  const {
    attributes,
    isDragging,
    isSorting,
    listeners,
    setDraggableNodeRef,
    setDroppableNodeRef,
    transform,
    transition,
  } = useSortable({
    id,
    animateLayoutChanges,
  });
  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <TreeItem
      ref={setDraggableNodeRef}
      wrapperRef={setDroppableNodeRef}
      style={style}
      depth={depth}
      ghost={isDragging}
      disableSelection={isAppleDevice()}
      disableInteraction={isSorting}
      id={id}
      categories={categories}
      title={title}
      route={route}
      clicked={clicked}
      handleProps={{
        ...attributes,
        ...listeners,
      }}
      {...props}
    />
  );
}
