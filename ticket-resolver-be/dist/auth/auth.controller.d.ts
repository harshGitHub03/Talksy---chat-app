import type { Response } from "express";
import { loginDto } from "./dtos/login.js";
import { AuthServices } from "./auth.services.js";
export declare class AuthController {
    private authService;
    constructor(authService: AuthServices);
    login(body: loginDto, res: Response): Promise<{
        success: boolean;
    }>;
    logout(res: Response): {
        success: boolean;
    };
}
