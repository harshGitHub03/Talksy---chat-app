import { Conversation } from '../../conversations/entities/conversation.js';
import { Messages } from '../../conversations/entities/messages.js';
export declare const rolesEnum: string[];
export declare class User {
    id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    conversations: Conversation[];
    messages: Messages[];
    createdAt: Date;
    updatedAt: Date;
}
