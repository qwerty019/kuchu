"use client";

import Script from "next/script";

const returnUrl = process.env.NEXT_PUBLIC_RETURN_URL;

export default function Payment({
  token,
  certId,
}: {
  token: string;
  certId?: string;
}) {
  const return_url = certId
    ? `${returnUrl}/thanks?certId=${certId}`
    : returnUrl;

  return (
    <>
      <div id='payment-form'></div>
      <Script
        src='https://yookassa.ru/checkout-widget/v1/checkout-widget.js'
        onLoad={() => {
          // @ts-ignore
          const checkout = new window.YooMoneyCheckoutWidget({
            confirmation_token: token, //Токен, который перед проведением оплаты нужно получить от ЮKassa
            return_url, //Ссылка на страницу завершения оплаты, это может быть любая ваша страница
            customization: {
              colors: {
                control_primary: "#A03968",
              },
            },
            error_callback: function (error: any) {
              console.log(error);
            },
          });

          //Отображение платежной формы в контейнере
          checkout.render("payment-form");
        }}
      />
    </>
  );
}
