import { IsNotEmpty, IsString } from 'class-validator';

export class EnrichAddressDto {
    @IsString()
    @IsNotEmpty()
    cep: string;
}