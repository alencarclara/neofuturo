import { Suspense } from 'react';
import { ContactList } from '../components/contacts-list';
import { TagFilter } from '../components/tag-filter';

type SearchParams = Promise<{ page?: string; tagId?: string }>;

export default function Home({ searchParams }: { searchParams: SearchParams }) {
  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-2xl font-semibold">Contatos</h1>

      <Suspense fallback={<p className="text-sm text-gray-500">Carregando tags...</p>}>
        <TagFilter searchParams={searchParams} />
      </Suspense>

      <Suspense fallback={<p className="text-sm text-gray-500">Carregando contatos...</p>}>
        <ContactList searchParams={searchParams} />
      </Suspense>
    </main>
  );
}