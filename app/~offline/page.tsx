import Link from "next/link";

export default function OfflinePage() {
  return (
    <main className='main-page flex flex-col items-center justify-center gap-4 text-center'>
      <h1 className='text-xl font-semibold'>Нет подключения к интернету</h1>
      <p className='max-w-sm text-sm text-muted-foreground'>
        Проверьте сеть и попробуйте снова. Каталог и оформление заказа доступны
        только онлайн.
      </p>
      <Link
        href='/'
        className='rounded-full bg-[#A03968] px-6 py-2 text-sm font-medium text-white'
      >
        На главную
      </Link>
    </main>
  );
}
