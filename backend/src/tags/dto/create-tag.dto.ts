import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTagDto {
    @IsString({ message: 'O nome da tag deve ser um texto' })
    @IsNotEmpty({ message: 'O nome da tag é obrigatório' })
    @MaxLength(50, { message: 'O nome da tag deve ter no máximo 50 caracteres' })
    name: string;
}
