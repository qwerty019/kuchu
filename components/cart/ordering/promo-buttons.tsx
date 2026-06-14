import { Button } from "../../ui/button";
import PromoCode from "./promo-code";
import CertCode from "./cert-code";
import { Info } from "../definitions";

export default function PromoButtons({
  setInfo,
  info,
}: {
  setInfo: React.Dispatch<React.SetStateAction<Info>>;
  info: Info;
}) {
  if (info.type === "promo") {
    return <PromoCode setInfo={setInfo} info={info} />;
  }

  if (info.type === "cert") {
    return <CertCode setInfo={setInfo} info={info} />;
  }

  return (
    <section className='flex items-center gap-2'>
      <Button
        type='button'
        variant='outline'
        className='rounded-full w-full px-4 text-xs'
        onClick={() => setInfo({ ...info, type: "cert" })}
      >
        Сертификат
      </Button>
      <Button
        type='button'
        variant='outline'
        className='rounded-full w-full px-4 text-xs'
        onClick={() => setInfo({ ...info, type: "promo" })}
      >
        Промокод
      </Button>
    </section>
  );
}
