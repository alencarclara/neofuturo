'use client';

import { useState } from 'react';
import type { ContactDetail, Tag } from '../types';
import { AddressPanel } from './address-panel';
import { SummaryPanel } from './summary-panel';
import { TagManager } from './tag-manager';

type Props = { initialContact: ContactDetail; allTags: Tag[] };

export function ContactDetailView({ initialContact, allTags }: Props) {
    const [contact, setContact] = useState(initialContact);

    return (
        <div className="space-y-8">
            <section>
                <h1 className="text-2xl font-semibold">{contact.fullName}</h1>
                <dl className="mt-3 grid grid-cols-[max-content_1fr] gap-x-6 gap-y-1 text-sm">
                    <dt className="text-gray-500">E-mail</dt>
                    <dd>{contact.email}</dd>
                    <dt className="text-gray-500">Telefone</dt>
                    <dd>{contact.phone}</dd>
                    <dt className="text-gray-500">Origem</dt>
                    <dd>{contact.source}</dd>
                    <dt className="text-gray-500">Cadastrado em</dt>
                    <dd>
                        {new Date(contact.createdAt).toLocaleDateString('pt-BR', {
                            timeZone: 'America/Sao_Paulo',
                        })}
                    </dd>
                </dl>
            </section>

            <TagManager contact={contact} allTags={allTags} onChange={setContact} />
            <SummaryPanel contact={contact} onChange={setContact} />
            <AddressPanel contact={contact} onChange={setContact} />
        </div>
    );
}