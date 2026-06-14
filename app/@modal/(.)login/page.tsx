import LoginForm from "@/components/login/login-form";
import { MainModal } from "@/components/modal/main-modal";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const { user } = await validateRequest();

  if (user) redirect("/");

  return (
    <MainModal
      title='Авторизация'
      className='h-full lg:h-[700px] flex flex-col'
      path='/login'
    >
      <LoginForm />
    </MainModal>
  );
}
