import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from "class-validator"
import { rolesEnum } from "../entities/user.js"


export class updateDto{
    @IsOptional()
    @IsString()
    name:string

   @IsEmail()
   @IsOptional()
    email:string

    @IsString()
    @MinLength(4)
    @IsOptional()
    password:string

    @IsOptional()
    @IsEnum(rolesEnum)
    role:string
}