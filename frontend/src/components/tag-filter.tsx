import Link from 'next/link';
import { getTags } from '../lib/api';
import { buildHref, toPositiveInt } from '../lib/search-params';

type Props = { searchParams: Promise<{ tagId?: string }> };

export async function TagFilter({ searchParams }: Props) {
    const [params, tags] = await Promise.all([searchParams, getTags()]);
    const activeId = toPositiveInt(params.tagId);

    if (tags.length === 0) return null;

    const chip = (active: boolean) =>
        `rounded-full border px-3 py-1 text-sm ${active ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 hover:bg-gray-100'
        }`;

    return (
        <nav className="mb-6 flex flex-wrap gap-2" aria-label="Filtrar por tag">
            <Link href={buildHref({})} className={chip(!activeId)}>
                Todas
            </Link>
            {tags.map((tag) => (
                <Link
                    key={tag.id}
                    href={buildHref({ tagId: tag.id })}
                    className={chip(tag.id === activeId)}
                >
                    {tag.name}
                </Link>
            ))}
        </nav>
    );
}