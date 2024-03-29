"use client";

import { useCardModal } from "@/hooks/use-card-modal";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import { Header } from "./header";
import { Description } from "./description";
import { Actions } from "./actions";
import { Activity } from "./activity";

export const CardModal = () => {
  const cardModal = useCardModal();

  const card = cardModal.card;
  const list = cardModal.list;

  return (
    <Dialog open={cardModal.isOpen} onOpenChange={cardModal.onClose}>
      <DialogContent className="bg-white overflow-hidden">
        {!card || !list ? (
          <Header.Skeleton />
        ) : (
          <Header data={card} list={list} />
        )}
        <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
          <div className="col-span-3">
            <div className="w-full space-y-6">
              {!card ? <Description.Skeleton /> : <Description data={card} />}
            </div>
          </div>
          {!card ? <Actions.Skeleton /> : <Actions data={card} />}
        </div>
        {!card ? <></> : <Activity card={card} />}
      </DialogContent>
    </Dialog>
  );
};
