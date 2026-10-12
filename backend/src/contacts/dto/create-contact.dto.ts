import { IsInt, isNotEmpty, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateContactDto {
    @IsString()
    @IsNotEmpty()
    fullName: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsOptional()
    @IsString()
    source?: string;
}