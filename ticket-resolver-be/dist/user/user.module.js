var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserController } from "./user.controller.js";
import { UserServices } from "./user.services.js";
import { User } from "./entities/user.js";
import { AuthModule } from "../auth/auth.module.js";
let UserModule = class UserModule {
};
UserModule = __decorate([
    Module({
        imports: [TypeOrmModule.forFeature([User]), AuthModule],
        controllers: [UserController],
        providers: [UserServices],
        exports: []
    })
], UserModule);
export { UserModule };
//# sourceMappingURL=user.module.js.map