export interface Tag {
    id: number;
    name: string;
}

export interface Address {
    cep: string;
    logradouro: string;
    bairro: string;
    cidade: string;
    uf: string;
}

export interface AiSummary {
    id: number;
    contactId: number;
    summaryText: string;
    generatedAt: string;
}

interface ContactBase {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    source: string;
    createdAt: string;
    address: Address | null;
    tags: Tag[];
}

export interface ContactListItem extends ContactBase {
    hasSummary: boolean;
}

export interface ContactDetail extends ContactBase {
    latestSummary: AiSummary | null;
}

export interface Paginated<T> {
    data: T[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface ImportReport {
    total: number;
    importedCount: number;
    rejectedCount: number;
    imported: { index: number; id: number; email: string }[];
    rejected: { index: number; input: unknown; reasons: string[] }[];
}