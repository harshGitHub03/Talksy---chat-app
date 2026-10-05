import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import type { Request } from "express";
import { ROLES_KEY } from "../metadata/setRole.js";

export type JwtPayload = {
    userId:string
    userEmail:string
    role:string
}

export type AuthedRequest = Request & { user:JwtPayload }

@Injectable()
export class AdminGuard implements CanActivate{
    constructor(
        private jwtService:JwtService,
        private reflector:Reflector
    ){}

    async canActivate(context:ExecutionContext){
        const req=context.switchToHttp().getRequest<AuthedRequest>()
        const token=req.cookies?.token
        if(!token)
            throw new UnauthorizedException()

        try{
            req.user=await this.jwtService.verifyAsync<JwtPayload>(token)
        }catch{
            throw new UnauthorizedException()
        }

        // roles from @Roles([...]) on the handler or controller
        const roles=this.reflector.getAllAndOverride<string[]>(ROLES_KEY,[
            context.getHandler(),
            context.getClass()
        ])
        if(roles?.length && !roles.includes(req.user.role))
            throw new ForbiddenException()

        return true
    }
}
