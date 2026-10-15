import Link from 'next/link';
import { Suspense } from 'react';
import { ContactLoader } from '../../../components/contact-loader';

type Params = Promise<{ id: string }>;

export default function ContactPage({ params }: { params: Params }) {
    return (
        <main className="mx-auto max-w-3xl p-6">
            <Link href="/" className="mb-6 inline-block text-sm text-blue-700 hover:underline">
                ← Voltar para a lista
            </Link>

            <Suspense fallback={<p className="text-sm text-gray-500">Carregando contato...</p>}>
                <ContactLoader params={params} />
            </Suspense>
        </main>
    );
}