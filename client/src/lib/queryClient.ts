import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

interface CustomFetchConfig {
  headers?: Record<string, string>;
  body?: any;
  [key: string]: any;
}

interface ApiRequestOptions {
  customConfig?: CustomFetchConfig;
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
  options?: ApiRequestOptions
): Promise<Response> {
  const defaultConfig: RequestInit = {
    method,
    headers: data && !options?.customConfig ? { "Content-Type": "application/json" } : {},
    body: data && !options?.customConfig?.body ? JSON.stringify(data) : undefined,
    credentials: "include",
  };

  // Merge with custom config if provided
  let config: RequestInit;
  if (options?.customConfig) {
    config = {
      ...defaultConfig,
      ...options.customConfig,
      method, // Ensure method is not overridden
    };
  } else {
    config = defaultConfig;
  }

  const res = await fetch(url, config);

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
