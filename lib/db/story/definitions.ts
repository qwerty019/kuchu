export type PageStory = {
  id: number;
  img: string;
  title: string;
  position: number | null;
  show: boolean;
  storybranches: { branchId: number }[];
  slides: PageSlide[];
};

type PageSlide = {
  id: number;
  img: string;
  title: string;
  text: string;
  subtitle: string | null;
  categoryId: number | null;
  link: string | null;
  button: string | null;
  category: Category | null;
};

type Category = {
  id: number;
  title: string;
  route: string;
};
