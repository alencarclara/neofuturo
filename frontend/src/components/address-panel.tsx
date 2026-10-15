'use client';

import { useState, type SubmitEvent } from 'react';
import { enrichAddress } from '../lib/api';
import type { ContactDetail } from '../types';

type Props = { contact: ContactDetail; onChange: (contact: ContactDetail) => void };

export function AddressPanel({ contact, onChange }: Props) {
    const [cep, setCep] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const address = contact.address;

    async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const updated = await enrichAddress(contact.id, cep);
            onChange(updated);
            setCep('');
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <section>
            <h2 className="mb-2 text-lg font-semibold">Endereço</h2>

            {address ? (
                <p className="mb-3 text-sm">
                    {[address.logradouro, address.bairro].filter(Boolean).join(', ')}
                    <br />
                    {address.cidade}/{address.uf} · CEP {address.cep}
                </p>
            ) : (
                <p className="mb-3 text-sm text-gray-500">Nenhum endereço cadastrado.</p>
            )}

            <form onSubmit={handleSubmit} className="flex gap-2">
                <label htmlFor="cep" className="sr-only">
                    CEP
                </label>
                <input
                    id="cep"
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    placeholder="00000-000"
                    inputMode="numeric"
                    maxLength={9}
                    disabled={loading}
                    className="w-32 rounded border px-2 py-1 text-sm"
                />
                <button
                    type="submit"
                    disabled={!cep.trim() || loading}
                    className="rounded bg-blue-600 px-3 py-1 text-sm text-white disabled:opacity-50"
                >
                    {loading ? 'Buscando...' : address ? 'Atualizar endereço' : 'Buscar endereço'}
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