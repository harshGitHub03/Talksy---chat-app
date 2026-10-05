import { BadRequestException, Controller, Injectable } from "@nestjs/common";
import { loginDto } from "./dtos/login.js";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../user/entities/user.js";
import * as bcrypt from "bcrypt"
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthServices{
    constructor(
        @InjectRepository(User)
        private User:Repository<User>,

        private jwtService:JwtService
    ){}
    
    async login(dto:loginDto){
        const {email,password}=dto
        const user=await this.User.findOne({where:{email}})
        if(!user)
            throw new BadRequestException("Invalid")

        const confirmed=await this.comparePasswords(password,user.password)
        if(!confirmed)
            throw new BadRequestException("Invalid")

        return this.jwtService.sign({userId:user.id,userEmail:user.email, role:user.role})
    }

    comparePasswords(newPass:string,savedPass:string){
        return bcrypt.compare(newPass,savedPass)
    }

    hashPassword(pass:string){
        return bcrypt.hash(pass,10)
    }
}