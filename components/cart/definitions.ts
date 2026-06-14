export type Info = {
  time: string;
  date: string;
  useCard: boolean;
  payment: string;
  comment: string;
  value: string | null;
  contact: string;
  promo: string;
  promoAmount?: number;
  promoPercent?: number;
  cert: string;
  type: string | null;
  banknote: string;
  interval: "asap" | "first" | "second" | "other";
};
