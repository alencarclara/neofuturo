import { ImportForm } from '../../components/import-form';

export default function ImportPage() {
    return (
        <main className="mx-auto max-w-5xl p-6">
            <h1 className="mb-2 text-2xl font-semibold">Importar contatos</h1>
            <p className="mb-6 text-sm text-gray-600">
                Envie um arquivo JSON com uma lista de contatos (<code>fullName</code>, <code>email</code>,{' '}
                <code>phone</code> e, opcionalmente, <code>source</code>).{' '}
                <a href="/exemplo-importacao.json" download className="text-blue-700 hover:underline">
                    Baixar um exemplo
                </a>
                .
            </p>
            <ImportForm />
        </main>
    );
}