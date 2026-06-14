import { SQL } from "drizzle-orm";

export type FilterParam = {
  type: string;
  values: string[];
};

export type CategoriesSectionProps = {
  query: string;
  allMatchingIdsForOptions: { goodId: number }[];
  categoryId?: string;
  filterParams: FilterParam[];
};

export type FiltersSectionProps = {
  query: string;
  allMatchingIdsForOptions: { goodId: number }[];
  filterParams: FilterParam[];
  categoryId?: string;
};

export type SearchResultsProps = {
  allMatchingIds: { goodId: number }[];
  matchingGoodIds: { goodId: number }[];
  searchOrder: SQL<unknown>;
  fallbackOrder: SQL<unknown>;
  branchId: number;
  suspenseKey: string;
  query: string;
};

export type GoodWithOsts = {
  id: number;
  regId: number;
  drug: string;
  form: string;
  img: string | null;
  title: string | null;
  subtitle: string | null;
  osts: {
    branchId: number;
    uQntOst: number;
    recipe: boolean;
    priceRoznWNDS: number;
    fixPriceValue: number;
    naklDataId: number;
  }[];
};

export type CategoryCount = {
  id: number | null;
  title: string;
  count: number;
};

export type GroupedFilter = {
  id: number;
  title: string;
  type: string;
  options: {
    value: string;
    count: number;
  }[];
};
