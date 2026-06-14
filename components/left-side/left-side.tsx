import CategoryLinks from "./category-links";

export default function LeftSide() {
  return (
    <section className='hidden ml-4 lg:block fixed w-60 shrink-0 bg-background h-[calc(100vh-64px-16px-16px)] rounded-2xl p-4'>
      <CategoryLinks />
    </section>
  );
}
