import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import type { Request } from "express";
export type JwtPayload = {
    userId: string;
    userEmail: string;
    role: string;
};
export type AuthedRequest = Request & {
    user: JwtPayload;
};
export declare class AdminGuard implements CanActivate {
    private jwtService;
    private reflector;
    constructor(jwtService: JwtService, reflector: Reflector);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
