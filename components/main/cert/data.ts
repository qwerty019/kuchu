export type Cert = {
  img: string;
  title: string;
  text: string | null;
  id: number;
  images: string[];
  subtitle: string | null;
};

export const cert: Cert = {
  id: 1,
  img: "/images/cert.png",
  title: "Дарите заботу",
  text: "Теперь вы можете оформить подарочные сертификаты для близких онлайн и отправить их прямо на электронную почту!\n \nУдобный и быстрый способ порадовать важных для нас людей.",
  images: ["/images/cert.png"],
  subtitle: null,
};
