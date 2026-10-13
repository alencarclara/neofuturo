export function normalizeTag(raw: string): string {
    const name = raw.trim().replace(/\s+/g, ' ').toLowerCase();

    if (name.length === 0) {
        throw new Error('Tag inválida: nome vazio ou só espaços');
    }

    return name;
}