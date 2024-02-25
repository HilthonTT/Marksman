import { Id } from "./convex/_generated/dataModel";

export type Board = {
  _id: Id<"boards">;
  orgId: string;
  title: string;
  imageId: string;
  imageThumbUrl: string;
  imageFullUrl: string;
  imageLinkHTML: string;
};

export type List = {
  _id: Id<"lists">;
  title: string;
  order: number;
  board: Id<"boards">;
};

export type Card = {
  _id: Id<"cards">;
  title: string;
  order: number;
  description?: string;
  list: Id<"lists">;
  _creationTime: number;
};

export type Comment = {
  _id: Id<"comments">;
  userId: string;
  card: Id<"cards">;
  comment: string;
  _creationTime: number;
};

export type CardWithComments = Card & {
  comments: Comment[];
};

export type ListWithCards = List & {
  cards: CardWithComments[];
};

export type User = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
};
