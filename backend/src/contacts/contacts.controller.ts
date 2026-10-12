import { Body, Controller, Post, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { ListContactsQueryDto } from './dto/query.dto';

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
}


