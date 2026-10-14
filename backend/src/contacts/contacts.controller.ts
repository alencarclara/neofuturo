import { Body, Controller, Post, Get, Param, ParseIntPipe, Query, Delete, HttpCode } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { ListContactsQueryDto } from './dto/query.dto';
import { AddTagDto } from './dto/add-tag.dto';

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
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.contactService.findOne(id);
    }

    @Post(':id/tags')
    addTag(@Param('id', ParseIntPipe) id: number, @Body() dto: AddTagDto) {
        return this.contactService.addTag(id, dto.tagId);
    }

    @Delete(':id/tags/:tagId')
    @HttpCode(204)
    removeTag(
        @Param('id', ParseIntPipe) id: number,
        @Param('tagId', ParseIntPipe) tagId: number,
    ) {
        return this.contactService.removeTag(id, tagId);
    }

    @Post('import')
    @HttpCode(200)
    import(@Body() raw: unknown) {
        return this.contactService.importMany(raw);
    }
}


