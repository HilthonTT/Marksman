"use client";

import { Draggable } from "@hello-pangea/dnd";

import { useCardModal } from "@/hooks/use-card-modal";
import { CardWithComments, ListWithCards } from "@/types";

interface CardItemProps {
  index: number;
  data: CardWithComments;
  list: ListWithCards;
}

export const CardItem = ({ index, data, list }: CardItemProps) => {
  const cardModal = useCardModal();

  const onClick = () => {
    cardModal.onOpen(data, list);
  };

  return (
    <Draggable draggableId={data._id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          role="button"
          onClick={onClick}
          className="truncate border-2 border-transparent rounded-md hover:border-black py-2 px-3 text-sm bg-white shadow-sm transition text-black">
          {data.title}
        </div>
      )}
    </Draggable>
  );
};
