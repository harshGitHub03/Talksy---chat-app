import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Messages } from './entities/messages.js';
import { Repository } from 'typeorm';
export declare class ChatGateway {
    private readonly Messages;
    private readonly jwtService;
    server: Server;
    private onlineUsers;
    constructor(Messages: Repository<Messages>, jwtService: JwtService);
    afterInit(server: Server): void;
    private getTokenFromCookie;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleGetOnlineUsers(): {
        onlineUsers: string[];
    };
    joinConversation(socket: Socket, data: {
        conversationId: string;
    }): void;
    leaveConversation(socket: Socket, data: {
        conversationId: string;
    }): void;
    sendText(socket: Socket, data: {
        conversationId: string;
        content: string;
    }): Promise<void>;
}
