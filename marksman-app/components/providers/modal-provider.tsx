"use client";

import { useIsClient } from "usehooks-ts";

import { CardModal } from "@/components/modals/card-modal";
import { CreateEventModal } from "@/components/modals/create-event-modal";
import { EventInfoModal } from "@/components/modals/event-info-modal";
import { ProModal } from "@/components/modals/pro-modal";

export const ModalProvider = () => {
  const isClient = useIsClient();

  if (!isClient) {
    return null;
  }

  return (
    <>
      <CardModal />
      <CreateEventModal />
      <EventInfoModal />
      <ProModal />
    </>
  );
};
