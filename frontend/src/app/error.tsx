'use client';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
    return (
        <main className="mx-auto max-w-5xl p-6">
            <h1 className="mb-2 text-xl font-semibold">Algo deu errado</h1>
            <p className="mb-4 text-gray-600">{error.message}</p>
            <button onClick={reset} className="rounded border px-3 py-1 text-sm hover:bg-gray-100">
                Tentar novamente
            </button>
        </main>
    );
}