export const fetcher = async (...args: Parameters<typeof fetch>) => {
  const res = await fetch(...args);

  if (!res.ok) {
    const info = await res.json();

    throw new Error(info.message);
  }

  return res.json();
};
