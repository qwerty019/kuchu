"use client";

export default function OrderDate({ createdAt }: { createdAt: Date | string }) {
  const localDate = new Date(createdAt).toLocaleString("ru-RU", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  return localDate;
}
