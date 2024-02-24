import { create } from "zustand";

import { Card, ListWithCards } from "@/types";

type CardModalStore = {
  card?: Card;
  list?: ListWithCards;
  isOpen: boolean;
  onOpen: (card: Card, list?: ListWithCards) => void;
  onClose: () => void;
};

export const useCardModal = create<CardModalStore>((set) => ({
  id: undefined,
  isOpen: false,
  onOpen: (card: Card, list?: ListWithCards) =>
    set({ isOpen: true, card, list }),
  onClose: () => set({ isOpen: false, card: undefined, list: undefined }),
}));
