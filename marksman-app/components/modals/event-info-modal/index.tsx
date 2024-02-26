"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal";

import { Header } from "./header";
import { Description } from "./description";
import { Actions } from "./actions";

export const EventInfoModal = () => {
  const modal = useModal((state) => state);

  const isOpen = modal.isOpen && modal.type === "eventInfo";

  const { event } = modal.data;

  const handleClose = () => {
    modal.onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <Header data={event!} />
        <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
          <div className="col-span-3">
            <div className="w-full space-y-6">
              <Description data={event!} />
            </div>
          </div>
          <Actions data={event!} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
