import type { AuthedRequest } from "../auth/guards/auth.guard.js";
import { UserServices } from "./user.services.js";
import { createUserDto } from "./ctos/createDto.js";
import { updateDto } from "./ctos/updateDto.js";
export declare class UserController {
    private userService;
    constructor(userService: UserServices);
    me(req: AuthedRequest): Promise<any>;
    contacts(req: AuthedRequest, page: number, limit: number, search?: string): Promise<{
        users: any;
        count: any;
        page: number;
        limit: number;
    }>;
    createUser(body: createUserDto): Promise<any>;
    all(page: number, limit: number, search?: string): Promise<{
        users: any;
        count: any;
        page: number;
        limit: number;
    }>;
    update(userId: string, body: updateDto): Promise<any>;
    delete(userId: string): Promise<{
        success: boolean;
    }>;
}
