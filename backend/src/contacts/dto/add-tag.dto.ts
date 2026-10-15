import { IsInt } from 'class-validator';

export class AddTagDto {
    @IsInt({ message: 'O tagId deve ser um número inteiro' })
    tagId: number;
}
