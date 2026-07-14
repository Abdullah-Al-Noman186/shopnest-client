const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:5000";

export async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;

  console.log("API Request:", url);

  try {
    const response = await fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    return response;
  } catch (error) {
    console.error("Fetch Error:", error);
    throw new Error(`Unable to connect to the API at ${url}`);
  }
}