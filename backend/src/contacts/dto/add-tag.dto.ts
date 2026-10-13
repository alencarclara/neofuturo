import { IsInt } from 'class-validator';

export class AddTagDto {
    @IsInt()
    tagId: number;
}
