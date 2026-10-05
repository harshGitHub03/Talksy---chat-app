var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
import { BadRequestException, UseGuards } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer, } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsAuthGuard } from './socket_guards/wsAuthGuard.js';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Messages } from './entities/messages.js';
import { Repository } from 'typeorm';
let ChatGateway = class ChatGateway {
    Messages;
    jwtService;
    server;
    onlineUsers = new Set();
    constructor(Messages, jwtService) {
        this.Messages = Messages;
        this.jwtService = jwtService;
    }
    afterInit(server) {
        server.use((socket, next) => {
            try {
                const cookie = socket.handshake.headers.cookie;
                if (!cookie)
                    return next(new Error('Unauthorized'));
                const token = this.getTokenFromCookie(cookie);
                if (!token)
                    return next(new Error('Unauthorized'));
                const payload = this.jwtService.verify(token);
                socket.data.user = payload;
                next();
            }
            catch {
                next(new Error('Unauthorized'));
            }
        });
    }
    getTokenFromCookie(cookie) {
        const tokenCookie = cookie
            .split(';')
            .map((item) => item.trim())
            .find((item) => item.startsWith('token='));
        return tokenCookie ? tokenCookie.split('=')[1] : null;
    }
    handleConnection(client) {
        const clientUid = client.data.user.userId;
        console.log('connected:', clientUid);
        this.onlineUsers.add(clientUid);
        this.server.emit('already-online-users', {
            alreadyOnlineUsers: [...this.onlineUsers],
        });
        if (clientUid)
            client.join(`user:${clientUid}`);
        this.server.emit(`user:online-stat`, {
            userId: clientUid,
            isOnline: true,
        });
        client.on('disconnecting', () => {
            console.log('disconnecting:', client.id);
            this.server.emit(`user:online-stat`, {
                userId: clientUid,
                isOnline: false,
            });
        });
    }
    handleDisconnect(client) {
        console.log('disconnect', client.id);
    }
    handleGetOnlineUsers() {
        return {
            onlineUsers: [...this.onlineUsers],
        };
    }
    joinConversation(socket, data) {
        console.log('join conver:', data.conversationId);
        if (data.conversationId)
            socket.join(`conversation:${data.conversationId}`);
    }
    leaveConversation(socket, data) {
        console.log('leave conver:', data.conversationId);
        socket.join(`conversation:${data.conversationId}`);
    }
    async sendText(socket, data) {
        if (!data.conversationId)
            throw new BadRequestException();
        console.log(data);
        const createdMsg = await this.Messages.save({
            content: data.content,
            conversation: { id: data.conversationId },
            sender: socket.data.user.userId,
        });
        this.server.to(`conversation:${data.conversationId}`).emit('newmessage', {
            id: createdMsg.id,
            senderId: socket.data.user.userId,
            content: data.content,
            conversationId: data.conversationId,
            createdAt: createdMsg.createdAt,
        });
    }
};
__decorate([
    WebSocketServer(),
    __metadata("design:type", Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    SubscribeMessage('online-users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleGetOnlineUsers", null);
__decorate([
    SubscribeMessage('joinconversation'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "joinConversation", null);
__decorate([
    SubscribeMessage('leaveconversation'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "leaveConversation", null);
__decorate([
    SubscribeMessage('sendmessage'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "sendText", null);
ChatGateway = __decorate([
    UseGuards(WsAuthGuard),
    WebSocketGateway({
        namespace: '/chat',
        cors: {
            origin: process.env.FRONTEND_URL,
            credentials: true,
        },
    }),
    __param(0, InjectRepository(Messages)),
    __metadata("design:paramtypes", [typeof (_a = typeof Repository !== "undefined" && Repository) === "function" ? _a : Object, JwtService])
], ChatGateway);
export { ChatGateway };
//# sourceMappingURL=chat.gateway.js.map