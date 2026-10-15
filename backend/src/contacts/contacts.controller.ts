import { Body, Controller, Post, Get, Param, Query, Delete, HttpCode } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { ListContactsQueryDto } from './dto/query.dto';
import { AddTagDto } from './dto/add-tag.dto';
import { EnrichAddressDto } from './dto/enrich-address-dto';
import { parseIntParam } from '../common/validation';

const contactIdPipe = parseIntParam('O id do contato');
const tagIdPipe = parseIntParam('O id da tag');

@Controller('contacts')
export class ContactsController {
    constructor(private readonly contactService: ContactsService) { }

    @Post()
    create(@Body() dto: CreateContactDto) {
        return this.contactService.create(dto);
    }

    @Get()
    findAll(@Query() query: ListContactsQueryDto) {
        return this.contactService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id', contactIdPipe) id: number) {
        return this.contactService.findOne(id);
    }

    @Post(':id/tags')
    addTag(@Param('id', contactIdPipe) id: number, @Body() dto: AddTagDto) {
        return this.contactService.addTag(id, dto.tagId);
    }

    @Delete(':id/tags/:tagId')
    @HttpCode(204)
    removeTag(
        @Param('id', contactIdPipe) id: number,
        @Param('tagId', tagIdPipe) tagId: number,
    ) {
        return this.contactService.removeTag(id, tagId);
    }

    @Post('import')
    @HttpCode(200)
    import(@Body() raw: unknown) {
        return this.contactService.importMany(raw);
    }

    @Post(':id/summarize')
    generateSummary(@Param('id', contactIdPipe) id: number) {
        return this.contactService.generateSummary(id);
    }

    @Post(':id/enrich-address')
    @HttpCode(200)
    enrichAddress(@Param('id', contactIdPipe) id: number, @Body() dto: EnrichAddressDto) {
        return this.contactService.enrichAddress(id, dto.cep);
    }
}


