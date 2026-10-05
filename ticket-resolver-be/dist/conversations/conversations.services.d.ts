import { User } from '../user/entities/user.js';
import { Repository } from 'typeorm';
import { Conversation } from './entities/conversation.js';
import { Messages } from './entities/messages.js';
export declare class ConversationsServices {
    private readonly User;
    private readonly Conversation;
    private readonly Messages;
    constructor(User: Repository<User>, Conversation: Repository<Conversation>, Messages: Repository<Messages>);
    upsertConversation(currentUserId: string, otherUserId: string): Promise<any>;
    listMessages({ conversationId, skip, limit }: {
        conversationId: string;
        skip: number;
        limit: number;
    }): Promise<{
        success: boolean;
        messages: any;
        ttlMsgCount: any;
        hasMore: boolean;
        skip: number;
        limit: number;
    }>;
}
