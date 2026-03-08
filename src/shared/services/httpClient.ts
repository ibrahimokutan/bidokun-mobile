class HttpError extends Error {
    constructor(
        public readonly status: number,
        message: string,
    ) {
        super(message);
        this.name = 'HttpError';
    }
}

async function get<T>(url: string): Promise<T> {
    const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });

    if (!response.ok) {
        throw new HttpError(
            response.status,
            `HTTP ${response.status}: ${response.statusText}`,
        );
    }

    return response.json() as Promise<T>;
}

export const httpClient = { get };
export { HttpError };
