import { loginDto } from "./dtos/login.js";
import { Repository } from "typeorm";
import { User } from "../user/entities/user.js";
import { JwtService } from "@nestjs/jwt";
export declare class AuthServices {
    private User;
    private jwtService;
    constructor(User: Repository<User>, jwtService: JwtService);
    login(dto: loginDto): Promise<string>;
    comparePasswords(newPass: string, savedPass: string): Promise<boolean>;
    hashPassword(pass: string): Promise<string>;
}
