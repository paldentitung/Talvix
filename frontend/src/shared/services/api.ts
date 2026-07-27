const API_BASE_URL = import.meta.env.VITE_API_URL;

const request = async (url: string, options?: RequestInit, auth = true) => {
  const res = await fetch(`${API_BASE_URL}${url}`, {
    ...(auth && { credentials: "include" }),
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

export default request;
