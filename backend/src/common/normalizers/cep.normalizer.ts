export function normalizeCep(raw: string): string {
    let digits = raw.replace(/\D/g, '');

    if (digits.length === 13 && digits.startsWith('55')) {
        digits = digits.slice(2);
    }

    if (digits.length !== 8) {
        throw new Error(`CEP inválido: "${raw}" deve ter 8 dígitos`);
    }

    return digits;
}