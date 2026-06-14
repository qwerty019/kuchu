"use client";

import React, { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronDown, GripVertical } from "lucide-react";
import { Actions } from "../actions";
import { Option } from "@/lib/definitions";
import { UniqueIdentifier } from "@dnd-kit/core";

export interface Props extends Omit<HTMLAttributes<HTMLLIElement>, "id"> {
  childCount?: number;
  clone?: boolean;
  collapsed?: boolean;
  depth: number;
  disableInteraction?: boolean;
  disableSelection?: boolean;
  ghost?: boolean;
  handleProps?: any;
  indicator?: boolean;
  indentationWidth: number;
  value: string;
  title: string;
  route: string;
  onCollapse?(): void;
  wrapperRef?(node: HTMLLIElement): void;
  id: UniqueIdentifier;
  categories: Option[];
  clicked: boolean;
}

export const TreeItem = forwardRef<HTMLDivElement, Props>(
  (
    {
      childCount,
      clone,
      depth,
      disableSelection,
      disableInteraction,
      ghost,
      handleProps,
      indentationWidth,
      indicator,
      collapsed,
      onCollapse,
      style,
      value,
      wrapperRef,
      id,
      categories,
      title,
      route,
      clicked,
      ...props
    },
    ref
  ) => {
    return (
      <li
        className={cn(
          // Base wrapper styles
          "list-none box-border -mb-px",
          // Clone styles
          clone && "inline-block pointer-events-none p-0 pl-2.5 pt-1.5",
          // Ghost styles
          ghost && !indicator && "opacity-50",
          ghost && indicator && "opacity-100 relative z-10 -mb-px",
          // Disable interaction
          disableInteraction && "pointer-events-none"
          // Disable selection (handled in child elements)
        )}
        ref={wrapperRef}
        style={
          {
            paddingLeft: `${indentationWidth * depth}px`,
          } as React.CSSProperties
        }
        {...props}
      >
        <div
          className={cn(
            // Base TreeItem styles
            "relative flex items-center py-2.5 px-2.5 bg-white border border-gray-300 text-gray-800 box-border",
            // Clone specific styles
            clone && "pr-6 rounded shadow-[0px_15px_15px_0_rgba(34,33,81,0.1)]",
            // Ghost indicator styles
            ghost &&
              indicator &&
              "relative p-0 h-2 border-blue-500 bg-blue-400 before:absolute before:-left-2 before:-top-1 before:block before:content-[''] before:w-3 before:h-3 before:rounded-full before:border before:border-blue-500 before:bg-white",
            // Ghost indicator children hidden
            ghost && indicator && "[&>*]:opacity-0 [&>*]:h-0",
            // Ghost non-indicator styles
            ghost && !indicator && "[&>*]:shadow-none [&>*]:bg-transparent"
          )}
          ref={ref}
          style={style}
        >
          <Button
            type='button'
            variant='ghost'
            size='icon'
            cursor='grab'
            data-cypress='draggable-handle'
            className='w-8 h-8 text-muted-foreground'
            disabled={clicked}
            {...handleProps}
          >
            <GripVertical className='w-4 h-4' />
          </Button>
          {onCollapse && (
            <Button
              type='button'
              variant='ghost'
              size='icon'
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                onCollapse();
              }}
              className={cn(
                "w-8 h-8 text-muted-foreground",
                // Collapse icon transition
                "[&>svg]:transition-transform [&>svg]:duration-250 [&>svg]:ease-in-out",
                // Collapsed state
                collapsed && "[&>svg]:rotate-[-90deg]"
              )}
            >
              <ChevronDown className='w-4 h-4' />
            </Button>
          )}
          <span
            className={cn(
              // Text styles
              "flex-grow pl-2 whitespace-nowrap text-ellipsis overflow-hidden text-sm",
              // Disable selection for clone and disableSelection
              (clone || disableSelection) && "select-none"
            )}
          >
            {title}
          </span>
          {!clone && <Actions categories={categories} id={id} route={route} />}
          {clone && childCount && childCount > 1 ? (
            <span
              className={cn(
                // Count badge styles
                "absolute -top-2.5 -right-2.5 flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-xs font-semibold text-white",
                // Disable selection for clone
                clone && "select-none"
              )}
            >
              {childCount}
            </span>
          ) : null}
        </div>
      </li>
    );
  }
);

TreeItem.displayName = "TreeItem";
