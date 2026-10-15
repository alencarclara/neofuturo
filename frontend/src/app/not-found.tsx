import Link from 'next/link';

export default function NotFound() {
    return (
        <main className="mx-auto max-w-5xl p-6">
            <h1 className="mb-2 text-xl font-semibold">Página não encontrada</h1>
            <p className="mb-4 text-gray-600">O endereço acessado não existe ou o contato foi removido.</p>
            <Link href="/" className="text-sm text-blue-700 hover:underline">
                ← Voltar para a lista
            </Link>
        </main>
    );
}
