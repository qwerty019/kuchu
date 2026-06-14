"use server";

import { getCerts, updateCertIsPaid, updateCertStatus } from "./db";
import { getCertificates } from "./farmbazis";

export async function handleCerts() {
  const start = getCurrentTime();

  const certificates = await getCertificates();

  if ("message" in certificates) {
    return { message: certificates.message };
  }

  const certs = await getCerts();

  if ("message" in certs) {
    return { message: certs.message };
  }

  const counts = {
    updated: 0,
    skipped: 0,
  };

  for (const cert of certs) {
    if (!cert.payments.some((p) => p.status === "paid")) {
      counts.skipped++;
      continue;
    }

    if (!cert.isPaid && cert.payments.some((p) => p.status === "paid")) {
      const action = await updateCertIsPaid(cert.id, true);

      if ("message" in action) {
        return { message: action.message };
      }

      counts.updated++;
    }

    const found = certificates.find((c) => c.cert_number === cert.number);

    if (!found) continue;

    if (found.status !== cert.status) {
      const action = await updateCertStatus(cert.id, found.status);

      if ("message" in action) {
        return { message: action.message };
      }

      counts.updated++;
    }
  }

  const end = getCurrentTime();

  return { ...counts, start, end };
}

function getCurrentTime() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
}
