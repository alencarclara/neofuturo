import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { ContactsModule } from './contacts/contacts.module';
import { TagsModule } from './tags/tags.module';
import { AiModule } from './ai/ai.module';
import { AddressModule } from './address/address.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, ContactsModule, TagsModule, AiModule, AddressModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
