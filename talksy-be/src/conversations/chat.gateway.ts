import { BadRequestException, UseGuards } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsAuthGuard } from './socket_guards/wsAuthGuard.js';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Messages } from './entities/messages.js';
import { Repository } from 'typeorm';

@UseGuards(WsAuthGuard)
@WebSocketGateway({
  namespace: '/chat',
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  private onlineUsers = new Set<string>();

  constructor(
    @InjectRepository(Messages)
    private readonly Messages: Repository<Messages>,

    private readonly jwtService: JwtService,
  ) {}

  afterInit(server: Server) {
    server.use((socket, next) => {
      try {
        const cookie = socket.handshake.headers.cookie;
        if (!cookie) return next(new Error('Unauthorized'));

        const token = this.getTokenFromCookie(cookie);
        if (!token) return next(new Error('Unauthorized'));

        const payload = this.jwtService.verify(token);
        socket.data.user = payload;
        next();
      } catch {
        next(new Error('Unauthorized'));
      }
    });
  }

  private getTokenFromCookie(cookie: string): string | null {
    const tokenCookie = cookie
      .split(';')
      .map((item) => item.trim())
      .find((item) => item.startsWith('token='));

    return tokenCookie ? tokenCookie.split('=')[1] : null;
  }

  handleConnection(client: Socket) {
    const clientUid = client.data.user.userId;
    console.log('connected:', clientUid);

    // Tell newly connected user who is already online
    this.onlineUsers.add(clientUid);
    this.server.emit('already-online-users', {
      alreadyOnlineUsers: [...this.onlineUsers],
    });

    if (clientUid) client.join(`user:${clientUid}`);
    // Tell everyone this user is now online
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

  handleDisconnect(client: Socket) {
    console.log('disconnect', client.id);
  }

  @SubscribeMessage('online-users')
  handleGetOnlineUsers() {
    return {
      onlineUsers: [...this.onlineUsers],
    };
  }

  // events
  @SubscribeMessage('joinconversation')
  joinConversation(socket: Socket, data: { conversationId: string }) {
    console.log('join conver:', data.conversationId);
    if (data.conversationId) socket.join(`conversation:${data.conversationId}`);
  }

  @SubscribeMessage('leaveconversation')
  leaveConversation(socket: Socket, data: { conversationId: string }) {
    console.log('leave conver:', data.conversationId);
    socket.join(`conversation:${data.conversationId}`);
  }

  @SubscribeMessage('sendmessage')
  async sendText(
    socket: Socket,
    data: { conversationId: string; content: string },
  ) {
    if (!data.conversationId) throw new BadRequestException();
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

  // Todo: users online status
}
