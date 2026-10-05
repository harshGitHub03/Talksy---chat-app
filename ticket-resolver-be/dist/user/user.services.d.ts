import { Repository } from 'typeorm';
import { User } from './entities/user.js';
import { createUserDto } from './ctos/createDto.js';
import { updateDto } from './ctos/updateDto.js';
import { AuthServices } from '../auth/auth.services.js';
export declare class UserServices {
    private User;
    private authServices;
    constructor(User: Repository<User>, authServices: AuthServices);
    findById(id: string): Promise<any>;
    contacts(userId: string, body: {
        page: number;
        limit: number;
        search?: string;
    }): Promise<{
        users: any;
        count: any;
        page: number;
        limit: number;
    }>;
    createUser(user: createUserDto): Promise<any>;
    all(body: {
        page: number;
        limit: number;
        search?: string;
    }): Promise<{
        users: any;
        count: any;
        page: number;
        limit: number;
    }>;
    updateOne(userId: string, body: updateDto): Promise<any>;
    deleteOne(userId: string): Promise<{
        success: boolean;
    }>;
}
