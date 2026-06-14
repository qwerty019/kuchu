import { Good } from "../good/definitions";

export type CollectionInPage = {
  id: number;
  title: string;
  position: number | null;
  show: boolean;
  collgoods: {
    id: number;
    good: Good;
  }[];
  _count?: {
    collgoods: number;
  };
};
