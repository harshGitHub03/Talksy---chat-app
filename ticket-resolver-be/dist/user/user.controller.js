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
import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, ParseUUIDPipe, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/guards/auth.guard.js";
import { UserServices } from "./user.services.js";
import { createUserDto } from "./ctos/createDto.js";
import { AdminGuard } from "../auth/guards/admin.guard.js";
import { Roles } from "../auth/metadata/setRole.js";
import { updateDto } from "./ctos/updateDto.js";
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    async me(req) {
        return await this.userService.findById(req.user.userId);
    }
    async contacts(req, page, limit, search) {
        return await this.userService.contacts(req.user.userId, { page, limit, search });
    }
    async createUser(body) {
        return await this.userService.createUser(body);
    }
    async all(page, limit, search) {
        return await this.userService.all({ page, limit, search });
    }
    async update(userId, body) {
        return await this.userService.updateOne(userId, body);
    }
    async delete(userId) {
        return await this.userService.deleteOne(userId);
    }
};
__decorate([
    Get("me"),
    UseGuards(AuthGuard),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "me", null);
__decorate([
    Get("contacts"),
    UseGuards(AuthGuard),
    __param(0, Req()),
    __param(1, Query("page", new DefaultValuePipe(1), ParseIntPipe)),
    __param(2, Query("limit", new DefaultValuePipe(20), ParseIntPipe)),
    __param(3, Query("search")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "contacts", null);
__decorate([
    UseGuards(AdminGuard),
    Roles(["admin"]),
    Post("create"),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createUser", null);
__decorate([
    UseGuards(AdminGuard),
    Roles(["admin"]),
    Get("all"),
    __param(0, Query("page", new DefaultValuePipe(1), ParseIntPipe)),
    __param(1, Query("limit", new DefaultValuePipe(10), ParseIntPipe)),
    __param(2, Query("search")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "all", null);
__decorate([
    UseGuards(AdminGuard),
    Roles(["admin"]),
    Patch(":userId"),
    __param(0, Param("userId", ParseUUIDPipe)),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, updateDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
__decorate([
    UseGuards(AdminGuard),
    Roles(["admin"]),
    Delete(":userId"),
    __param(0, Param("userId", ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "delete", null);
UserController = __decorate([
    Controller("user"),
    __metadata("design:paramtypes", [UserServices])
], UserController);
export { UserController };
//# sourceMappingURL=user.controller.js.map