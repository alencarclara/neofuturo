import { notFound } from 'next/navigation';
import { ApiError, getContact, getTags } from '../lib/api';
import { toPositiveInt } from '../lib/search-params';
import { ContactDetailView } from './contact-detail-view';

type Props = { params: Promise<{ id: string }> };

export async function ContactLoader({ params }: Props) {
    const { id: rawId } = await params;
    const id = toPositiveInt(rawId);
    if (!id) notFound();

    const [contact, tags] = await Promise.all([getContact(id), getTags()]).catch((error) => {
        if (error instanceof ApiError && error.status === 404) notFound();
        throw error;
    });

    return <ContactDetailView initialContact={contact} allTags={tags} />;
}