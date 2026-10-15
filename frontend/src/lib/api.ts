import type {
    AiSummary,
    ContactDetail,
    ContactListItem,
    ImportReport,
    Paginated,
    Tag,
} from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export class ApiError extends Error {
    constructor(
        message: string,
        public readonly status: number,
    ) {
        super(message);
    }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${API_URL}${path}`, {
        ...init,
        headers: { 'Content-Type': 'application/json', ...init?.headers },
        cache: 'no-store',
    });

    if (!response.ok) {
        const body = await response.json().catch(() => null);
        const message = Array.isArray(body?.message)
            ? body.message.join('; ')
            : (body?.message ?? `Erro ${response.status}`);
        throw new ApiError(message, response.status);
    }

    if (response.status === 204) return undefined as T;
    return response.json() as Promise<T>;
}

// Contatos

export function getContacts(params: { page?: number; limit?: number; tagId?: number }) {
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    if (params.tagId) query.set('tagId', String(params.tagId));
    return request<Paginated<ContactListItem>>(`/contacts?${query}`);
}

export function getContact(id: number) {
    return request<ContactDetail>(`/contacts/${id}`);
}

export function importContacts(contacts: unknown) {
    return request<ImportReport>('/contacts/import', {
        method: 'POST',
        body: JSON.stringify(contacts),
    });
}

// Tags

export function getTags() {
    return request<Tag[]>('/tags');
}

export function createTag(name: string) {
    return request<Tag>('/tags', {
        method: 'POST',
        body: JSON.stringify({ name }),
    });
}

export function addTagToContact(contactId: number, tagId: number) {
    return request<ContactDetail>(`/contacts/${contactId}/tags`, {
        method: 'POST',
        body: JSON.stringify({ tagId }),
    });
}

export function removeTagFromContact(contactId: number, tagId: number) {
    return request<void>(`/contacts/${contactId}/tags/${tagId}`, { method: 'DELETE' });
}

// Integrações

export function generateSummary(contactId: number) {
    return request<AiSummary>(`/contacts/${contactId}/summarize`, { method: 'POST' });
}

export function enrichAddress(contactId: number, cep: string) {
    return request<ContactDetail>(`/contacts/${contactId}/enrich-address`, {
        method: 'POST',
        body: JSON.stringify({ cep }),
    });
}