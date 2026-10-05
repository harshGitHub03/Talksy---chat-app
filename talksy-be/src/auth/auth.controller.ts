import { Body, Controller, HttpCode, Post, Res } from "@nestjs/common";
import type { Response } from "express";
import { loginDto } from "./dtos/login.js";
import { AuthServices } from "./auth.services.js";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

@Controller("auth")
export class AuthController{
    constructor(
        private authService:AuthServices
    ){}

    @Post("login")
    @HttpCode(200)
    async login(@Body() body:loginDto, @Res({passthrough:true}) res:Response){
        const token=await this.authService.login(body)
        res.cookie("token",token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==="production",
            sameSite:"lax",
            maxAge:ONE_DAY_MS
        })
        return {success:true}
    }

    @Post("logout")
    @HttpCode(200)
    logout(@Res({passthrough:true}) res:Response){
        res.clearCookie("token")
        return {success:true}
    }
}
