import Email from "@/components/certificate/email";
import { NextRequest } from "next/server";
import { MailerooClient } from "maileroo";
import { render } from "@react-email/render";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get("email");
  const cert_number = searchParams.get("cert_number");
  const nominal = searchParams.get("nominal");

  if (!email || !cert_number || !nominal) {
    return Response.json(
      { message: "Параметры запроса не найдены." },
      { status: 400 }
    );
  }

  try {
    const maileroo = MailerooClient.getClient(process.env.MAILEROO_API_KEY);

    const emailHtml = await render(
      Email({ cert_number, nominal: Number(nominal) })
    );

    maileroo
      .setFrom("KUCHU", "info@kuchu.shop")
      .setTo(`Получатель`, email)
      .setSubject("Письмо с сертификатом")
      .setHtml(emailHtml)
      .setTracking(true);

    await maileroo.sendBasicEmail();

    return Response.json({ success: true }, { status: 200 });
  } catch (err) {
    console.log(err);
    return Response.json(
      { message: "Что-то пошло не так. Повторите еще." },
      { status: 500 }
    );
  }
}
