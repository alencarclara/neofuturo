import Link from 'next/link';
import { buildHref } from '../lib/search-params';

type Props = {
    meta: { page: number; totalPages: number; total: number };
    tagId?: number;
};

export function Pagination({ meta, tagId }: Props) {
    const { page, totalPages, total } = meta;
    if (totalPages <= 1) return null;

    const linkClass = 'rounded border px-3 py-1 text-sm hover:bg-gray-100';
    const disabledClass = 'rounded border px-3 py-1 text-sm text-gray-300';

    return (
        <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-gray-500">
                Página {page} de {totalPages} · {total} contatos
            </span>
            <div className="flex gap-2">
                {page > 1 ? (
                    <Link href={buildHref({ page: page - 1, tagId })} className={linkClass}>
                        Anterior
                    </Link>
                ) : (
                    <span className={disabledClass}>Anterior</span>
                )}
                {page < totalPages ? (
                    <Link href={buildHref({ page: page + 1, tagId })} className={linkClass}>
                        Próxima
                    </Link>
                ) : (
                    <span className={disabledClass}>Próxima</span>
                )}
            </div>
        </div>
    );
}