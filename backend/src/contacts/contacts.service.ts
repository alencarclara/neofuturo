import { BadRequestException, ConflictException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Prisma } from '../generated/prisma/client';
import { normalizeCep, normalizeEmail, normalizeName, normalizePhone } from '../common/normalizers';
import { CreateContactDto } from './dto/create-contact.dto';
import { catchError } from 'rxjs';
import { ListContactsQueryDto } from './dto/query.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { AiService } from '../ai/ai.service';
import { AddressService } from '../address/address.service';

const imported: { index: number; id: number; email: string }[] = [];
const rejected: { index: number; input: unknown; reasons: string[] }[] = [];

@Injectable()
export class ContactsService {
    constructor(private readonly prisma: PrismaService, private readonly aiService: AiService, private readonly addressService: AddressService) { }

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

    async importMany(raw: unknown) {
        if (!Array.isArray(raw)) {
            throw new BadRequestException('O corpo deve ser uma lista (array) de contatos');
        }
        if (raw.length === 0) {
            throw new BadRequestException('A lista está vazia');
        }
        if (raw.length > 500) {
            throw new BadRequestException('Máximo de 500 livros por importação');
        }

        for (const [index, item] of raw.entries()) {
            const reasons = await this.validateItem(item);
            if (reasons.length > 0) {
                rejected.push({ index, input: item, reasons });
                continue;
            }

            const dto = plainToInstance(CreateContactDto, item);
            try {
                const contact = await this.create({ ...dto, source: dto.source ?? 'import' });
                imported.push({ index, id: contact.id, email: contact.email })
            } catch (error) {
                if (error instanceof HttpException) {
                    rejected.push({ index, input: item, reasons: [error.message] });
                } else {
                    throw error;
                }
            }
        }

        return {
            total: raw.length,
            importedCount: imported.length,
            rejectedCount: rejected.length,
            imported,
            rejected,
        };
    }

    private async validateItem(item: unknown): Promise<string[]> {
        if (typeof item != 'object' || item === null || Array.isArray(item)) {
            return ['O item não é um objeto'];
        }

        const dto = plainToInstance(CreateContactDto, item);
        const errors = await validate(dto, { whitelist: true, forbidNonWhitelisted: true });

        return errors.flatMap((e) => Object.values(e.constraints ?? {}));
    }

    async generateSummary(id: number) {
        const contact = await this.findOne(id);

        const text = await this.aiService.generateContactSummary({
            fullName: contact.fullName,
            email: contact.email,
            phone: contact.phone,
            tags: contact.tags.map((t) => t.name)
        });

        return this.prisma.aiSummary.create({ data: { contactId: id, summaryText: text } });
    }

    async enrichAddress(id: number, rawCep: string) {
        await this.findOne(id);

        let cep: string;
        try {
            cep = normalizeCep(rawCep);
        } catch (error) {
            throw new BadRequestException((error as Error).message);
        }

        const address = await this.addressService.lookupCep(cep);

        await this.prisma.contact.update({
            where: { id },
            data: { address: { ...address } }
        });

        return this.findOne(id);
    }
}
