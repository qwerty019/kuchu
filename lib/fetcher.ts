class CustomError extends Error {
  status: number | undefined;
}

export const fetcher = async (url: string) => {
  const res = await fetch(url);

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    // Attach extra info to the error object.
    const data = await res.json();
    const message = data?.message || "Что-то пошло не так";

    const error = new CustomError(message);
    error.status = res.status;
    throw error;
  }

  return res.json();
};

export const fetchPost = async (url: string, body: any) => {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const data = await res.json();
    const message = data?.message || "Что-то пошло не так";

    const error = new CustomError(message);
    error.status = res.status;
    throw error;
  }

  return res.json();
};
