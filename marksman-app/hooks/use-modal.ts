import { create } from "zustand";

import { Event } from "@/types";

export type ModalType = "createEvent" | "eventInfo" | "pro" | "createItem";

interface ModalData {
  start?: Date;
  allDay?: boolean;
  event?: Event;
  orgId?: string;
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  data: {},
  onOpen: (type: ModalType, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ isOpen: false, type: null }),
}));
