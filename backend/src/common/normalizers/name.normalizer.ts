export function normalizeName(raw: string): string {
    const name = raw.trim().replace(/\s+/g, ' ');

    if (name.length === 0) {
        throw new Error(`Nome inválido: nome vazio ou só espaços`);
    }

    return name;
}