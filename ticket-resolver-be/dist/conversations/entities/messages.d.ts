import type { Relation } from 'typeorm';
import { User } from '../../user/entities/user.js';
import { Conversation } from './conversation.js';
export declare class Messages {
    id: string;
    content: string;
    sender: Relation<User>;
    conversation: Relation<Conversation>;
    createdAt: Date;
}
