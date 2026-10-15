import { NextResponse, type NextRequest } from 'next/server';
import { toPositiveInt } from './lib/search-params';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

// A página de detalhe faz streaming (Suspense), então um notFound() lá dentro sai com
// HTTP 200. Checando a existência aqui, antes da renderização, a resposta sai como 404.
export async function proxy(request: NextRequest) {
    const rawId = request.nextUrl.pathname.split('/')[2];
    const id = toPositiveInt(rawId);

    if (id) {
        const response = await fetch(`${API_URL}/contacts/${id}`, { method: 'HEAD', cache: 'no-store' }).catch(
            () => null,
        );
        // Se o backend estiver fora do ar ou der outro erro, a página trata e mostra o error.tsx.
        if (response?.status !== 404) return NextResponse.next();
    }

    // Reescreve para uma rota que não existe: o Next renderiza o not-found.tsx com status 404.
    return NextResponse.rewrite(new URL('/_contato-nao-encontrado', request.url));
}

export const config = {
    matcher: '/contacts/:id',
};
