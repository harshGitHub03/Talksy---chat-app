import { User } from '../../user/entities/user.js';
import { Messages } from './messages.js';
export declare const CONVERSATION_TYPES_ENUM: {
    direct: string;
    group: string;
};
export declare class Conversation {
    id: string;
    type: string;
    users: User[];
    messages: Messages[];
    createdAt: Date;
    updatedAt: Date;
}
