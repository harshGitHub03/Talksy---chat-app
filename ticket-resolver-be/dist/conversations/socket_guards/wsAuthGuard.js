var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
let WsAuthGuard = class WsAuthGuard {
    jwtService;
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    canActivate(context) {
        const client = context.switchToWs().getClient();
        const cookie = client.handshake.headers.cookie;
        if (!cookie)
            throw new UnauthorizedException();
        const token = this.getTokenFromCookie(cookie);
        if (!token)
            throw new UnauthorizedException();
        try {
            const payload = this.jwtService.verify(token);
            client.data.user = payload;
        }
        catch (error) {
            throw new UnauthorizedException();
        }
        return true;
    }
    getTokenFromCookie(cookie) {
        const tokenCookie = cookie
            .split(';')
            .map((item) => item.trim())
            .find((item) => item.startsWith('token='));
        return tokenCookie
            ? tokenCookie.split('=')[1]
            : null;
    }
};
WsAuthGuard = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [JwtService])
], WsAuthGuard);
export { WsAuthGuard };
//# sourceMappingURL=wsAuthGuard.js.map