import { Good } from "../good/definitions";

export type Sale = {
  img: string;
  title: string;
  text: string | null;
  id: number;
  images: string[] | null;
  subtitle: string | null;
  salegoods: {
    good: Good;
  }[];
  category: {
    goods: Good[];
    id: number;
    title: string;
    route: string;
  } | null;
};
