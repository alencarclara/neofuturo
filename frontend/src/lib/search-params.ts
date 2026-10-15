export function toPositiveInt(value: string | undefined): number | undefined {
    const n = Number(value);
    return Number.isInteger(n) && n > 0 ? n : undefined;
}

export function buildHref(params: Record<string, number | undefined>): string {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) query.set(key, String(value));
    }
    const qs = query.toString();
    return qs ? `/?${qs}` : '/';
}