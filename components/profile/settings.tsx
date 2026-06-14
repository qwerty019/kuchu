"use client";

import { User } from "@/lib/auth";
import ChangePhone from "./change-phone";
import DeleteAccount from "./delete-account";
import Preferences from "./preferences";
import { useState } from "react";
import ChangeDob from "./change-dob";

export default function Settings({
  user,
  data: initial,
}: {
  user: User;
  data: { promo: boolean; share: boolean };
}) {
  const [data, setData] = useState(initial);

  return (
    <section className='space-y-2'>
      <ChangePhone user={user} />
      <ChangeDob user={user} />
      {data && <Preferences data={data} setData={setData} />}
      <DeleteAccount />
    </section>
  );
}
