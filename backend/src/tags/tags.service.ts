import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { normalizeTag } from '../common/normalizers';
import { CreateTagDto } from './dto/create-tag.dto';
import { PrismaService } from '../database/prisma.service';
import { Prisma } from '../generated/prisma/client';


@Injectable()
export class TagsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(dto: CreateTagDto) {
        let name: string;
        try {
            name = normalizeTag(dto.name);
        } catch (error) {
            throw new BadRequestException((error as Error).message);
        }

        try {
            return await this.prisma.tag.create({ data: { name } });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new ConflictException(`A tag "${name}" já existe`);
            }
            throw error;
        }
    }

    findAll() {
        return this.prisma.tag.findMany({ orderBy: { name: 'asc' } });
    }
}
