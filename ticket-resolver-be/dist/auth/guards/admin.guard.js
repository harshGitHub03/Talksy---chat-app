var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
import { ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { ROLES_KEY } from "../metadata/setRole.js";
let AdminGuard = class AdminGuard {
    jwtService;
    reflector;
    constructor(jwtService, reflector) {
        this.jwtService = jwtService;
        this.reflector = reflector;
    }
    async canActivate(context) {
        const req = context.switchToHttp().getRequest();
        const token = req.cookies?.token;
        if (!token)
            throw new UnauthorizedException();
        try {
            req.user = await this.jwtService.verifyAsync(token);
        }
        catch {
            throw new UnauthorizedException();
        }
        const roles = this.reflector.getAllAndOverride(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ]);
        if (roles?.length && !roles.includes(req.user.role))
            throw new ForbiddenException();
        return true;
    }
};
AdminGuard = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [JwtService, typeof (_a = typeof Reflector !== "undefined" && Reflector) === "function" ? _a : Object])
], AdminGuard);
export { AdminGuard };
//# sourceMappingURL=admin.guard.js.map