import { Module } from '@nestjs/common';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';
import { AiModule } from '../ai/ai.module';
import { AddressModule } from '../address/address.module';

@Module({
  imports: [AiModule, AddressModule],
  controllers: [ContactsController],
  providers: [ContactsService]
})
export class ContactsModule { }
