'use client';

import { useState } from 'react';
import { ApiError, generateSummary } from '../lib/api';
import type { ContactDetail } from '../types';

type Props = { contact: ContactDetail; onChange: (contact: ContactDetail) => void };

export function SummaryPanel({ contact, onChange }: Props) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const summary = contact.latestSummary;

    async function handleGenerate() {
        setLoading(true);
        setError(null);
        try {
            const newSummary = await generateSummary(contact.id);
            onChange({ ...contact, latestSummary: newSummary });
        } catch (e) {
            if (e instanceof ApiError && e.status === 503) {
                setError('A integração com IA não está configurada no servidor.');
            } else {
                setError((e as Error).message);
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <section>
            <h2 className="mb-2 text-lg font-semibold">Resumo de IA</h2>

            {summary ? (
                <div className="mb-3 rounded border bg-gray-50 p-3 text-sm">
                    <p>{summary.summaryText}</p>
                    <p className="mt-2 text-xs text-gray-500">
                        Gerado em{' '}
                        {new Date(summary.generatedAt).toLocaleString('pt-BR', {
                            timeZone: 'America/Sao_Paulo',
                        })}
                    </p>
                </div>
            ) : (
                <p className="mb-3 text-sm text-gray-500">Nenhum resumo gerado ainda.</p>
            )}

            <button
                onClick={handleGenerate}
                disabled={loading}
                className="rounded bg-blue-600 px-3 py-1 text-sm text-white disabled:opacity-50"
            >
                {loading ? 'Gerando...' : 'Gerar resumo com IA'}
            </button>

            {error && (
                <p role="alert" className="mt-2 text-sm text-red-600">
                    {error}
                </p>
            )}
        </section>
    );
}