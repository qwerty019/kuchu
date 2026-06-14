import {
  HomeIcon,
  Rows3,
  LucideIcon,
  Percent,
  Pill,
  Tag,
  Users,
  Gift,
  ListIcon,
  ScrollText,
  Lightbulb,
  Filter,
  Search,
  SearchCheck,
  ShoppingBag,
  X,
  Sparkle,
} from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { AccordionTrigger } from "../ui/accordion";
import { CategoryLeftSide } from "@/lib/db/category/schema";

export function CategoryTrigger({ category }: { category: CategoryLeftSide }) {
  const { cat } = useParams();

  return (
    <AccordionTrigger
      className={`py-0 hover:text-primary hover:no-underline [&>svg]:hidden ${
        category.children.find((c) => c.route === cat)
          ? "text-primary"
          : "text-muted-foreground"
      }`}
    >
      <div className='flex items-center gap-2'>
        <Avatar className='w-8 h-8  aspect-square rounded-md'>
          <AvatarImage
            src={category.url || undefined}
            alt={category.title}
            className='w-8 h-8 aspect-square object-cover rounded-md'
          />
          <AvatarFallback className='p-2 rounded-md text-muted-foreground bg-[#F2F2F2] flex items-center justify-center'>
            <Pill className='w-4 h-4' />
          </AvatarFallback>
        </Avatar>
        <p className='text-sm'>{category.title}</p>
      </div>
    </AccordionTrigger>
  );
}

export function NestedCategory({
  child,
  setOpen,
}: {
  child: {
    id: number;
    route: string;
    title: string;
  };
  setOpen?: (open: boolean) => void;
}) {
  const { cat } = useParams();

  return (
    <Link
      href={`/category/${child.route}`}
      className={`block ml-8 font-medium hover:text-primary w-full whitespace-pre-wrap ${
        cat === child.route ? "text-primary" : "text-muted-foreground"
      }`}
      onClick={() => setOpen?.(false)}
    >
      {child.title}
    </Link>
  );
}

export function AdminLink({
  link,
}: {
  link: {
    value: string;
    label: string;
    icon: LucideIcon;
  };
}) {
  const pathname = usePathname();

  return (
    <Link href={link.value} className='flex items-center gap-2'>
      <div className='p-2 rounded-md bg-accent'>
        <link.icon className='w-4 h-4' />
      </div>
      <p
        className={`text-sm font-medium ${
          pathname.startsWith(link.value)
            ? "text-primary"
            : "text-muted-foreground"
        }`}
      >
        {link.label}
      </p>
    </Link>
  );
}

export const adminLinks = [
  { value: "/admin/cities", label: "Города и филиалы", icon: HomeIcon },
  { value: "/admin/categories", label: "Категории", icon: ListIcon },
  { value: "/admin/goods", label: "Товары", icon: Tag },
  { value: "/admin/users", label: "Пользователи", icon: Users },
  { value: "/admin/sales", label: "Акции", icon: Percent },
  { value: "/admin/texts", label: "Текста", icon: ScrollText },
  { value: "/admin/collection", label: "Подборки", icon: Rows3 },
  { value: "/admin/certificates", label: "Сертификаты", icon: Gift },
  { value: "/admin/orders", label: "Заказы", icon: ShoppingBag },
  { value: "/admin/suggestions", label: "Подсказки", icon: Lightbulb },
  { value: "/admin/filters", label: "Фильтры", icon: Filter },
  { value: "/admin/search", label: "Поиск", icon: Search },
  { value: "/admin/exclusions", label: "Исключения", icon: X },
  { value: "/admin/ai", label: "AI", icon: Sparkle },
];
