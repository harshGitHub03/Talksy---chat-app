import { ConversationsServices } from "./conversations.services.js";
export declare class ConversationsController {
    private readonly conversationServices;
    constructor(conversationServices: ConversationsServices);
    getConversation(currentUser: {
        userId: string;
    }, otherUserId: string): Promise<any>;
    listMessages(query: {
        conversationId: string;
        skip?: string | number;
        limit?: string | number;
    }): Promise<{
        success: boolean;
        messages: any;
        ttlMsgCount: any;
        hasMore: boolean;
        skip: number;
        limit: number;
    }>;
}
