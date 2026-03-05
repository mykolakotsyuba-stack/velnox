// SSR (сервер → сервер): використовує internal URL щоб уникнути NAT петлі
// Client (браузер → nginx): використовує публічний URL
const API_BASE =
    typeof window === 'undefined'
        ? (process.env.INTERNAL_API_URL ?? 'http://127.0.0.1:8507/api/v1')
        : (process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8507/api/v1');

interface FetchOptions extends RequestInit {
    params?: Record<string, string | number | undefined>;
}

export async function apiFetch<T>(
    path: string,
    { params, ...options }: FetchOptions = {}
): Promise<T> {
    const url = new URL(`${API_BASE}${path}`);

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) url.searchParams.set(key, String(value));
        });
    }

    const response = await fetch(url.toString(), {
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        // Next.js: вимкнуто кешування для розробки (можна повернути 60 пізніше)
        next: { revalidate: 0 },
        ...options,
    });

    if (!response.ok) {
        throw new Error(`API Error ${response.status}: ${path}`);
    }

    return response.json() as Promise<T>;
}
