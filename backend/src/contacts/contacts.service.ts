import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Prisma } from '../generated/prisma/client';
import { normalizeEmail, normalizeName, normalizePhone } from '../common/normalizers';
import { CreateContactDto } from './dto/create-contact.dto';
import { catchError } from 'rxjs';

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
}
