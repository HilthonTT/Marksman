"use client";

import { useMutation, useQuery } from "convex/react";
import { DragDropContext, DropResult, Droppable } from "@hello-pangea/dnd";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Skeleton } from "@/components/ui/skeleton";

import { ListItem } from "./list-item";
import { ListForm } from "./list-form";
import { useEffect, useState } from "react";
import { ListWithCards } from "@/types";

interface ListContainerProps {
  boardId: Id<"boards">;
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);

  result.splice(endIndex, 0, removed);

  return result;
}

export const ListContainer = ({ boardId }: ListContainerProps) => {
  const lists = useQuery(api.lists.getByBoardId, {
    boardId,
  });

  const updateListOrder = useMutation(api.lists.updateOrder);
  const updateCardOrder = useMutation(api.cards.updateOrder);

  const [orderedData, setOrderedData] = useState<ListWithCards[] | null>(null);

  useEffect(() => {
    if (!lists) {
      return;
    }

    setOrderedData(lists);
  }, [lists]);

  if (!orderedData) {
    return <ListContainer.Skeleton />;
  }

  const onDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;

    if (!destination) {
      return;
    }

    // Dropped into the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // User moves a list
    if (type === "list") {
      const items = reorder(orderedData, source.index, destination.index).map(
        (item, index) => ({
          ...item,
          order: index,
        })
      );

      const mappedItems = items.map((item) => {
        return { title: item.title, order: item.order, _id: item._id };
      });

      const promise = updateListOrder({ items: mappedItems, boardId });
      setOrderedData(items);

      toast.promise(promise, {
        loading: "Reordering list...",
        success: "List reordered!",
        error: "Failed to reorder the list.",
      });
    }

    if (type === "card") {
      let newOrderedData = [...orderedData];

      const sourceList = newOrderedData.find(
        (list) => list._id === source.droppableId
      );
      const destList = newOrderedData.find(
        (list) => list._id === destination.droppableId
      );

      if (!sourceList || !destList) {
        return;
      }

      if (!sourceList.cards) {
        sourceList.cards = [];
      }

      if (!destList.cards) {
        destList.cards = [];
      }

      // Moving card in the same list
      if (source.droppableId === destination.droppableId) {
        const reorderedCards = reorder(
          sourceList.cards,
          source.index,
          destination.index
        );

        reorderedCards.forEach((card, idx) => {
          card.order = idx;
        });

        console.log(reorderedCards);

        sourceList.cards = reorderedCards;

        const promise = updateCardOrder({ items: reorderedCards, boardId });
        setOrderedData(newOrderedData);

        toast.promise(promise, {
          loading: "Reordering cards...",
          success: "Cards reordered!",
          error: "Failed to reorder cards.",
        });
      } else {
        // Remove card from the source list
        const [movedCard] = sourceList.cards.splice(source.index, 1);

        // Assign the new listId to the moved card
        movedCard.list = destination.droppableId as Id<"lists">;

        // Add card to the destination list
        destList.cards.splice(destination.index, 0, movedCard);

        sourceList.cards.forEach((card, idx) => {
          card.order = idx;
        });

        // Update the order for each card in the destination list
        destList.cards.forEach((card, idx) => {
          card.order = idx;
        });

        const promise = updateCardOrder({ items: destList.cards, boardId });
        setOrderedData(newOrderedData);

        toast.promise(promise, {
          loading: "Reordering cards...",
          success: "Cards reordered!",
          error: "Failed to reorder cards.",
        });
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex gap-x-3 h-full">
            {orderedData.map((list, index) => (
              <ListItem key={list._id} data={list} index={index} />
            ))}
            {provided.placeholder}
            <ListForm />
            <div className="flex-shrink-0 w-1" />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
};

ListContainer.Skeleton = function ListContainerSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full h-full">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="w-[80%] h-72 opacity-80" />
      ))}
    </div>
  );
};
