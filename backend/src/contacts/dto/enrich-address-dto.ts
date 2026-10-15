import { IsNotEmpty, IsString } from 'class-validator';

export class EnrichAddressDto {
    @IsString({ message: 'O CEP deve ser um texto' })
    @IsNotEmpty({ message: 'O CEP é obrigatório' })
    cep: string;
}
