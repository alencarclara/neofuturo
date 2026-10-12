export function normalizePhone(raw: string): string {
    let digits = raw.replace(/\D/g, '');

    if (digits.length === 13 && digits.startsWith('55')) {
        digits = digits.slice(2);
    }

    if (digits.length !== (11)) {
        throw new Error(`Número de celular inválido: "${raw}" deve ter 11 dígitos (DDD + número)`);
    }

    if (!/^[1-9]\d9\d{8}$/.test(digits)) {
        throw new Error(`Número de celular inválido: "${raw}" deve ter DDD válido e começar com 9`);
    }

    return digits.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
}