var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../user/entities/user.js";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
let AuthServices = class AuthServices {
    User;
    jwtService;
    constructor(User, jwtService) {
        this.User = User;
        this.jwtService = jwtService;
    }
    async login(dto) {
        const { email, password } = dto;
        const user = await this.User.findOne({ where: { email } });
        if (!user)
            throw new BadRequestException("Invalid");
        const confirmed = await this.comparePasswords(password, user.password);
        if (!confirmed)
            throw new BadRequestException("Invalid");
        return this.jwtService.sign({ userId: user.id, userEmail: user.email, role: user.role });
    }
    comparePasswords(newPass, savedPass) {
        return bcrypt.compare(newPass, savedPass);
    }
    hashPassword(pass) {
        return bcrypt.hash(pass, 10);
    }
};
AuthServices = __decorate([
    Injectable(),
    __param(0, InjectRepository(User)),
    __metadata("design:paramtypes", [typeof (_a = typeof Repository !== "undefined" && Repository) === "function" ? _a : Object, JwtService])
], AuthServices);
export { AuthServices };
//# sourceMappingURL=auth.services.js.map