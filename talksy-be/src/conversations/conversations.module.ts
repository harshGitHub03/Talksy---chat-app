import { Module } from '@nestjs/common';
import { ConversationsServices } from './conversations.services.js';
import { ConversationsController } from './conversations.controller.js';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ChatGateway } from './chat.gateway.js';
import { AuthModule } from '../auth/auth.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.js';
import { Messages } from './entities/messages.js';
import { User } from '../user/entities/user.js';

@Module({
  // AuthModule exports JwtModule (with the secret), which WsAuthGuard needs
  imports: [TypeOrmModule.forFeature([Conversation,Messages,User]) ,AuthModule],
  controllers: [ConversationsController],
  providers: [ConversationsServices, ChatGateway],
  exports: [],
})
export class ConversastionsModule {}
