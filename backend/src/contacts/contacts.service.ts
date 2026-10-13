import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Prisma } from '../generated/prisma/client';
import { normalizeEmail, normalizeName, normalizePhone } from '../common/normalizers';
import { CreateContactDto } from './dto/create-contact.dto';
import { catchError } from 'rxjs';
import { ListContactsQueryDto } from './dto/query.dto';

@Injectable()
export class ContactsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(dto: CreateContactDto) {
        let fullName: string;
        let email: string;
        let phone: string;
        try {
            fullName = normalizeName(dto.fullName);
            email = normalizeEmail(dto.email);
            phone = normalizePhone(dto.phone);
        } catch (error) {
            throw new BadRequestException((error as Error).message);
        }

        try {
            return await this.prisma.contact.create({
                data: {
                    fullName,
                    email,
                    phone,
                    source: dto.source ?? 'manual',
                },
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new ConflictException(`Já existe um contato com o e-mail ${email}`)
            }
            throw error;
        }
    }

    async findOne(id: number) {
        const contact = await this.prisma.contact.findUnique({
            where: { id },
            include: {
                tags: { include: { tag: true } },
                summaries: { orderBy: { generatedAt: 'desc' }, take: 1 },
            },
        });

        if (!contact) {
            throw new NotFoundException(`Contato ${id} não encontrado`);
        }

        const { tags, summaries, ...rest } = contact;

        return {
            ...rest,
            tags: tags.map((ct) => ct.tag),
            latestSummary: summaries[0] ?? null,
        };
    }

    async findAll({ page, limit, tagId }: ListContactsQueryDto) {
        const where: Prisma.ContactWhereInput = tagId
            ? { tags: { some: { tag: { id: tagId } } } }
            : {};

        const [contacts, total] = await this.prisma.$transaction([
            this.prisma.contact.findMany({
                where,
                orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    tags: { include: { tag: true } },
                    _count: { select: { summaries: true } },
                },
            }),
            this.prisma.contact.count({ where }),
        ]);

        return {
            data: contacts.map(({ tags, _count, ...rest }) => ({
                ...rest,
                tags: tags.map((ct) => ct.tag),
                hasSummary: _count.summaries > 0,
            })),
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async addTag(contactId: number, tagId: number) {
        try {
            await this.prisma.contactTag.create({
                data: { contactId, tagId },
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ConflictException('Esse contato já tem essa tag');
                }
                if (error.code === 'P2003') {
                    throw new NotFoundException('Contato ou tag não encontrado');
                }
            }
            throw error;
        }

        return this.findOne(contactId);
    }

    async removeTag(contactId: number, tagId: number) {
        try {
            await this.prisma.contactTag.delete({
                where: { contactId_tagId: { contactId, tagId } },
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new NotFoundException('Esse livro não tem essa categoria');
            }
            throw error;
        }
    }
}
