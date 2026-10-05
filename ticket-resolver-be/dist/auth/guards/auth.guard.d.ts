import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
export type JwtPayload = {
    userId: string;
    userEmail: string;
};
export type AuthedRequest = Request & {
    user: JwtPayload;
};
export declare class AuthGuard implements CanActivate {
    private jwtService;
    constructor(jwtService: JwtService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
export declare const CurrentUser: any;
