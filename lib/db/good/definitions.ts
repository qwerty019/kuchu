export type Good = {
  form: string;
  id: number;
  regId: number;
  drug: string;
  img: string | null;
  title: string | null;
  subtitle: string | null;
  ost: {
    priceRoznWNDS: number;
    fixPriceValue: number;
    branchId: number;
    uQntOst: number;
    recipe: boolean;
    naklDataId: number;
  }[];
};

export type GoodDetails = {
  id: number;
  regId: number;
  drug: string;
  drugId: number;
  form: string;
  formId: number;
  fabr: string;
  mnn: string;
  img: string | null;
  title: string | null;
  subtitle: string | null;
  ost: {
    branchId: number;
    uQntOst: number;
    recipe: boolean;
    priceRoznWNDS: number;
    fixPriceValue: number;
    naklDataId: number;
  }[];
  contents: {
    id: number;
    title: string;
    content: string;
  }[];
};
