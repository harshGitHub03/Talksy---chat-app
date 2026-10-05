import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserController } from "./user.controller.js";
import { UserServices } from "./user.services.js";
import { User } from "./entities/user.js";
import { AuthModule } from "../auth/auth.module.js";


@Module({
    imports:[TypeOrmModule.forFeature([User]),AuthModule],
    controllers:[UserController],
    providers:[UserServices],
    exports:[]
})
export class UserModule{}
