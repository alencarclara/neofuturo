import Link from 'next/link';
import { getContacts } from '../lib/api';
import { toPositiveInt } from '../lib/search-params';
import { Pagination } from './pagination';

type Props = { searchParams: Promise<{ page?: string; tagId?: string }> };

export async function ContactList({ searchParams }: Props) {
    const params = await searchParams;
    const page = toPositiveInt(params.page) ?? 1;
    const tagId = toPositiveInt(params.tagId);

    const { data: contacts, meta } = await getContacts({ page, tagId });

    if (contacts.length === 0) {
        return (
            <p className="text-gray-500">
                {tagId ? 'Nenhum contato com essa tag.' : 'Nenhum contato cadastrado ainda.'}
            </p>
        );
    }

    return (
        <>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="border-b text-gray-500">
                        <tr>
                            <th className="py-2 pr-4">Nome</th>
                            <th className="py-2 pr-4">E-mail</th>
                            <th className="py-2 pr-4">Telefone</th>
                            <th className="py-2 pr-4">Tags</th>
                            <th className="py-2">Resumo IA</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contacts.map((contact) => (
                            <tr key={contact.id} className="border-b hover:bg-gray-50">
                                <td className="py-2 pr-4">
                                    <Link
                                        href={`/contacts/${contact.id}`}
                                        className="font-medium text-blue-700 hover:underline"
                                    >
                                        {contact.fullName}
                                    </Link>
                                </td>
                                <td className="py-2 pr-4">{contact.email}</td>
                                <td className="py-2 pr-4 whitespace-nowrap">{contact.phone}</td>
                                <td className="py-2 pr-4">
                                    <div className="flex flex-wrap gap-1">
                                        {contact.tags.map((tag) => (
                                            <span key={tag.id} className="rounded bg-gray-100 px-2 py-0.5 text-xs">
                                                {tag.name}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="py-2">
                                    {contact.hasSummary ? (
                                        <span className="rounded bg-green-100 px-2 py-0.5 text-xs whitespace-nowrap text-green-800">
                                            ✓ Com resumo
                                        </span>
                                    ) : (
                                        <span className="text-xs text-gray-400">—</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination meta={meta} tagId={tagId} />
        </>
    );
}