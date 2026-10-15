'use client';

import { useState, type SubmitEvent } from 'react';
import { addTagToContact, createTag, removeTagFromContact } from '../lib/api';
import type { ContactDetail, Tag } from '../types';

type Props = {
    contact: ContactDetail;
    allTags: Tag[];
    onChange: (contact: ContactDetail) => void;
};

export function TagManager({ contact, allTags: initialTags, onChange }: Props) {
    const [allTags, setAllTags] = useState(initialTags);
    const [selectedId, setSelectedId] = useState('');
    const [newTagName, setNewTagName] = useState('');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const available = allTags.filter((tag) => !contact.tags.some((t) => t.id === tag.id));

    async function run(action: () => Promise<void>) {
        setBusy(true);
        setError(null);
        try {
            await action();
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setBusy(false);
        }
    }

    function handleAdd() {
        run(async () => {
            const updated = await addTagToContact(contact.id, Number(selectedId));
            onChange(updated);
            setSelectedId('');
        });
    }

    function handleCreate(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        run(async () => {
            const tag = await createTag(newTagName);
            setAllTags((tags) => [...tags, tag].sort((a, b) => a.name.localeCompare(b.name)));
            setNewTagName('');
            onChange(await addTagToContact(contact.id, tag.id));
        });
    }

    function handleRemove(tagId: number) {
        run(async () => {
            await removeTagFromContact(contact.id, tagId);
            onChange({ ...contact, tags: contact.tags.filter((t) => t.id !== tagId) });
        });
    }

    return (
        <section>
            <h2 className="mb-2 text-lg font-semibold">Tags</h2>

            {contact.tags.length === 0 ? (
                <p className="mb-3 text-sm text-gray-500">Nenhuma tag.</p>
            ) : (
                <ul className="mb-3 flex flex-wrap gap-2">
                    {contact.tags.map((tag) => (
                        <li
                            key={tag.id}
                            className="flex items-center gap-1 rounded-full bg-gray-100 py-1 pr-1 pl-3 text-sm"
                        >
                            {tag.name}
                            <button
                                onClick={() => handleRemove(tag.id)}
                                disabled={busy}
                                aria-label={`Remover tag ${tag.name}`}
                                className="rounded-full px-2 text-gray-500 hover:bg-gray-200 disabled:opacity-50"
                            >
                                ×
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {available.length > 0 && (
                <div className="flex gap-2">
                    <select
                        value={selectedId}
                        onChange={(e) => setSelectedId(e.target.value)}
                        disabled={busy}
                        className="rounded border px-2 py-1 text-sm"
                    >
                        <option value="">Escolha uma tag...</option>
                        {available.map((tag) => (
                            <option key={tag.id} value={tag.id}>
                                {tag.name}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={handleAdd}
                        disabled={!selectedId || busy}
                        className="rounded bg-blue-600 px-3 py-1 text-sm text-white disabled:opacity-50"
                    >
                        Adicionar
                    </button>
                </div>
            )}

            <form onSubmit={handleCreate} className="mt-2 flex gap-2">
                <label htmlFor="new-tag" className="sr-only">
                    Nova tag
                </label>
                <input
                    id="new-tag"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    placeholder="Nova tag"
                    maxLength={50}
                    disabled={busy}
                    className="rounded border px-2 py-1 text-sm"
                />
                <button
                    type="submit"
                    disabled={!newTagName.trim() || busy}
                    className="rounded border border-blue-600 px-3 py-1 text-sm text-blue-700 disabled:opacity-50"
                >
                    Criar e adicionar
                </button>
            </form>

            {error && (
                <p role="alert" className="mt-2 text-sm text-red-600">
                    {error}
                </p>
            )}
        </section>
    );
}