import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateContactDto {
    @IsString({ message: 'O nome deve ser um texto' })
    @IsNotEmpty({ message: 'O nome é obrigatório' })
    fullName: string;

    @IsString({ message: 'O e-mail deve ser um texto' })
    @IsNotEmpty({ message: 'O e-mail é obrigatório' })
    email: string;

    @IsString({ message: 'O telefone deve ser um texto' })
    @IsNotEmpty({ message: 'O telefone é obrigatório' })
    phone: string;

    @IsOptional()
    @IsString({ message: 'A origem (source) deve ser um texto' })
    source?: string;
}