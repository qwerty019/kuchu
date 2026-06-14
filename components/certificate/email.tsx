import * as React from "react";
import {
  Html,
  Button,
  Section,
  Img,
  Text,
  Tailwind,
  Body,
  Container,
} from "@react-email/components";

export function Email(props: { cert_number: string; nominal: number }) {
  const { cert_number, nominal } = props;

  return (
    <Html lang='ru'>
      <Tailwind>
        <Body className='bg-white my-auto mx-auto font-sans px-2'>
          <Container className='border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]'>
            <Section className='my-[16px]'>
              <Img
                alt='Картинка сертификата'
                className='w-full rounded-[12px] object-contain'
                src={`https://kuchu.shop/images/cert-${nominal}-text.png`}
              />
              <Section className='my-[32px] text-center'>
                <Img
                  alt='Я осознанный подарок от локальной аптеки kuchu. Меня подарили, чтобы вы запаслись витаминами и другими качественными средствами для заботы о себе!'
                  className='w-full object-contain'
                  src='https://kuchu.shop/images/text-large.png'
                />
              </Section>
              <Section className='bg-slate-100 max-w-xs w-full rounded-xl h-[64px] flex-col items-center justify-center'>
                <Text className='font-semibold text-3xl m-0 text-center w-full'>
                  {cert_number}
                </Text>
                <Text className='text-gray-500 text-xs m-0 text-center w-full'>
                  Номер сертификата
                </Text>
              </Section>
              <Section className='mt-[32px] text-center'>
                <Button
                  className='rounded-full bg-[#A03968] px-[40px] py-[12px] font-semibold text-white'
                  href='https://kuchu.shop'
                >
                  К покупкам
                </Button>
              </Section>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default Email;
