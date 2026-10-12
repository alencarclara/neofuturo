export function normalizeEmail(raw: string): string {
    const email = raw.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error(`E-mail inválido: "${raw}" deve estar no formato nome@dominio.com`)
    }

    return email
}