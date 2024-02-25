import { create } from "zustand";

import { CardWithComments, ListWithCards } from "@/types";

type CardModalStore = {
  card?: CardWithComments;
  list?: ListWithCards;
  isOpen: boolean;
  onOpen: (card: CardWithComments, list?: ListWithCards) => void;
  onClose: () => void;
};

export const useCardModal = create<CardModalStore>((set) => ({
  id: undefined,
  isOpen: false,
  onOpen: (card: CardWithComments, list?: ListWithCards) =>
    set({ isOpen: true, card, list }),
  onClose: () => set({ isOpen: false, card: undefined, list: undefined }),
}));
