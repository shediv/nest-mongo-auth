import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateUserDto {
    @IsNotEmpty()
    firstName: string;

    @IsOptional()
    @IsNotEmpty()
    lastName: string;

    @IsOptional()
    @IsNotEmpty()
    email: string;

    @IsOptional()
    @IsNotEmpty()
    phoneNumber: string;

    @IsNotEmpty()
    dob: string;

    @IsNotEmpty()
    picture: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    isActive: boolean;
}