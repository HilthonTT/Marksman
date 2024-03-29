"use client";

import { Draggable, Droppable } from "@hello-pangea/dnd";
import { ElementRef, useRef, useState } from "react";

import { ListWithCards } from "@/types";
import { cn } from "@/lib/utils";

import { ListHeader } from "./list-header";
import { CardForm } from "./card-form";
import { CardItem } from "./card-item";

interface ListItemProps {
  index: number;
  data: ListWithCards;
}

export const ListItem = ({ index, data }: ListItemProps) => {
  const textareaRef = useRef<ElementRef<"textarea">>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const disableEditing = () => {
    setIsEditing(false);
  };

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      textareaRef?.current?.focus();
    });
  };

  return (
    <Draggable draggableId={data._id} index={index}>
      {(provided) => (
        <li
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="shrink-0 h-full w-[272px] select-none">
          <div
            {...provided.dragHandleProps}
            className="w-full rounded-md bg-[#F1F2F4] shadow-md pb-2">
            <ListHeader onAddCard={enableEditing} data={data} />
            <Droppable droppableId={data._id} type="card">
              {(provided) => (
                <ol
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={cn(
                    "mx-1 px-1 py-0.5 flex flex-col gap-y-2",
                    data.cards?.length > 0 ? "mt-2" : "mt-0"
                  )}>
                  {data.cards.map((card, index) => (
                    <CardItem
                      key={card._id}
                      data={card}
                      index={index}
                      list={data}
                    />
                  ))}

                  {provided.placeholder}
                </ol>
              )}
            </Droppable>
            <CardForm
              ref={textareaRef}
              listId={data._id}
              isEditing={isEditing}
              enableEditing={enableEditing}
              disableEditing={disableEditing}
            />
          </div>
        </li>
      )}
    </Draggable>
  );
};
