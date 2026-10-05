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
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Not, Repository } from 'typeorm';
import { User } from './entities/user.js';
import { AuthServices } from '../auth/auth.services.js';
const PUBLIC_FIELDS = { id: true, name: true, email: true, role: true, createdAt: true };
let UserServices = class UserServices {
    User;
    authServices;
    constructor(User, authServices) {
        this.User = User;
        this.authServices = authServices;
    }
    async findById(id) {
        const user = await this.User.findOne({
            where: { id },
            select: PUBLIC_FIELDS,
        });
        if (!user)
            throw new UnauthorizedException();
        return user;
    }
    async contacts(userId, body) {
        const page = Math.max(1, body.page);
        const limit = Math.min(Math.max(1, body.limit), 50);
        const search = body.search?.trim();
        const notMe = { id: Not(userId) };
        const where = search
            ? [
                { ...notMe, name: ILike(`%${search}%`) },
                { ...notMe, email: ILike(`%${search}%`) },
            ]
            : notMe;
        const [users, count] = await this.User.findAndCount({
            where,
            select: { id: true, name: true, email: true },
            order: { name: 'ASC', email: 'ASC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { users, count, page, limit };
    }
    async createUser(user) {
        const userExist = await this.User.findOne({ where: { email: user.email } });
        if (userExist)
            throw new BadRequestException('Already exists');
        const password = await this.authServices.hashPassword(user.password);
        const { id } = await this.User.save(this.User.create({ ...user, password }));
        return await this.findById(id);
    }
    async all(body) {
        const page = Math.max(1, body.page);
        const limit = Math.min(Math.max(1, body.limit), 100);
        const skip = (page - 1) * limit;
        const search = body.search?.trim();
        const [users, count] = await this.User.findAndCount({
            where: search
                ? [{ name: ILike(`%${search}%`) }, { email: ILike(`%${search}%`) }]
                : undefined,
            select: PUBLIC_FIELDS,
            order: { createdAt: 'ASC' },
            skip,
            take: limit,
        });
        return {
            users,
            count,
            page,
            limit,
        };
    }
    async updateOne(userId, body) {
        if (body?.email) {
            const taken = await this.User.findOne({ where: { email: body.email } });
            if (taken && taken.id !== userId)
                throw new BadRequestException('Already exists');
        }
        if (body?.password)
            body.password = await this.authServices.hashPassword(body.password);
        const result = await this.User.update({ id: userId }, body);
        if (!result.affected)
            throw new NotFoundException('User not found');
        return await this.findById(userId);
    }
    async deleteOne(userId) {
        const result = await this.User.delete({ id: userId });
        if (!result.affected)
            throw new NotFoundException('User not found');
        return { success: true };
    }
};
UserServices = __decorate([
    Injectable(),
    __param(0, InjectRepository(User)),
    __metadata("design:paramtypes", [typeof (_a = typeof Repository !== "undefined" && Repository) === "function" ? _a : Object, AuthServices])
], UserServices);
export { UserServices };
//# sourceMappingURL=user.services.js.map