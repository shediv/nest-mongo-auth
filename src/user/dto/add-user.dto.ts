import { IsNotEmpty, IsMobilePhone } from 'class-validator';

export class AddUserDto {
    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;

    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsMobilePhone()
    phoneNumber: number;

    @IsNotEmpty()
    dob: string;

    @IsNotEmpty()
    password: string;

}