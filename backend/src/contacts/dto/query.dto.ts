import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class ListContactsQueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'A página (page) deve ser um número inteiro' })
    @Min(1, { message: 'A página (page) deve ser no mínimo 1' })
    page: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'O limite (limit) deve ser um número inteiro' })
    @Min(1, { message: 'O limite (limit) deve ser no mínimo 1' })
    @Max(100, { message: 'O limite (limit) deve ser no máximo 100' })
    limit: number = 10;

    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'O tagId deve ser um número inteiro' })
    tagId?: number;
}
