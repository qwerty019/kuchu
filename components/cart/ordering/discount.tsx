import Card from "./card";
import PromoButtons from "./promo-buttons";
import { Info } from "../definitions";

export default function Discount({
  setInfo,
  info,
}: {
  setInfo: React.Dispatch<React.SetStateAction<Info>>;
  info: Info;
}) {
  return (
    <section className='flex flex-col flex-1 bg-background rounded-2xl p-4 gap-4'>
      <p className='font-semibold text-lg'>Скидки и выгода</p>
      <PromoButtons info={info} setInfo={setInfo} />
      <Card info={info} setInfo={setInfo} />
    </section>
  );
}
