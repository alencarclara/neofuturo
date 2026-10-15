export function normalizeCep(raw: string): string {
    const digits = raw.replace(/\D/g, '');

    if (digits.length !== 8) {
        throw new Error(`CEP inválido: "${raw}" deve ter 8 dígitos`);
    }

    return digits;
}