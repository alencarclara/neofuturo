'use client';

import { useRef, useState, type SubmitEvent } from 'react';
import { importContacts } from '../lib/api';
import type { ImportReport } from '../types';

export function ImportForm() {
    const fileInput = useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [report, setReport] = useState<ImportReport | null>(null);

    async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        const file = fileInput.current?.files?.[0];
        if (!file) return;

        setLoading(true);
        setError(null);
        setReport(null);

        try {
            let contacts: unknown;
            try {
                contacts = JSON.parse(await file.text());
            } catch {
                throw new Error('O arquivo não é um JSON válido.');
            }
            setReport(await importContacts(contacts));
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-3">
                <label className="cursor-pointer rounded border border-dashed px-4 py-2 text-sm hover:bg-gray-50">
                    {fileName ?? 'Escolher arquivo .json'}
                    <input
                        ref={fileInput}
                        type="file"
                        accept=".json,application/json"
                        className="sr-only"
                        onChange={(e) => {
                            setFileName(e.target.files?.[0]?.name ?? null);
                            setReport(null);
                            setError(null);
                        }}
                    />
                </label>
                <button
                    type="submit"
                    disabled={!fileName || loading}
                    className="rounded bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-50"
                >
                    {loading ? 'Importando...' : 'Importar'}
                </button>
            </form>

            {error && (
                <p role="alert" className="text-sm text-red-600">
                    {error}
                </p>
            )}

            {report && <ImportReportView report={report} />}
        </div>
    );
}

function ImportReportView({ report }: { report: ImportReport }) {
    return (
        <section className="space-y-4">
            <div className="grid grid-cols-3 gap-3 text-center">
                <Stat label="Total" value={report.total} />
                <Stat label="Importados" value={report.importedCount} tone="green" />
                <Stat label="Rejeitados" value={report.rejectedCount} tone="red" />
            </div>

            {report.rejected.length > 0 && (
                <div>
                    <h2 className="mb-2 text-lg font-semibold">Rejeitados</h2>
                    <table className="w-full text-left text-sm">
                        <thead className="border-b text-gray-500">
                            <tr>
                                <th className="py-2 pr-4">Item</th>
                                <th className="py-2 pr-4">Contato</th>
                                <th className="py-2">Motivos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {report.rejected.map((r) => (
                                <tr key={r.index} className="border-b align-top">
                                    <td className="py-2 pr-4">#{r.index + 1}</td>
                                    <td className="py-2 pr-4">{describeInput(r.input)}</td>
                                    <td className="py-2">
                                        <ul className="list-disc pl-4 text-red-700">
                                            {r.reasons.map((reason) => (
                                                <li key={reason}>{reason}</li>
                                            ))}
                                        </ul>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {report.imported.length > 0 && (
                <div>
                    <h2 className="mb-2 text-lg font-semibold">Importados</h2>
                    <ul className="text-sm">
                        {report.imported.map((i) => (
                            <li key={i.id}>
                                #{i.index + 1} ·{' '}
                                <a href={`/contacts/${i.id}`} className="text-blue-700 hover:underline">
                                    {i.email}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </section>
    );
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: 'green' | 'red' }) {
    const color =
        tone === 'green' ? 'text-green-700' : tone === 'red' ? 'text-red-700' : 'text-gray-900';
    return (
        <div className="rounded border p-3">
            <div className={`text-2xl font-semibold ${color}`}>{value}</div>
            <div className="text-xs text-gray-500">{label}</div>
        </div>
    );
}

function describeInput(input: unknown): string {
    if (input && typeof input === 'object' && !Array.isArray(input)) {
        const obj = input as Record<string, unknown>;
        const parts = [obj.fullName, obj.email].filter((v) => typeof v === 'string' && v.trim());
        if (parts.length > 0) return parts.join(' · ');
    }
    const text = JSON.stringify(input);
    return text.length > 60 ? `${text.slice(0, 60)}…` : text;
}