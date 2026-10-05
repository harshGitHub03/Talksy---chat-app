import { IsEmail, IsEnum, IsNotEmpty, IsOptional, MinLength, minLength } from "class-validator"
import { rolesEnum } from "../entities/user.js"



export class createUserDto{
    @IsOptional()
    name:string

    @IsEmail()
    @IsNotEmpty()
    email:string

    @MinLength(4)
    @IsNotEmpty()
    password:string

    @IsEnum(rolesEnum)
    @IsNotEmpty()
    role:string
}