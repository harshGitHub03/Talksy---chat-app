var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { ConversationsServices } from './conversations.services.js';
import { ConversationsController } from './conversations.controller.js';
import { ChatGateway } from './chat.gateway.js';
import { AuthModule } from '../auth/auth.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.js';
import { Messages } from './entities/messages.js';
import { User } from '../user/entities/user.js';
let ConversastionsModule = class ConversastionsModule {
};
ConversastionsModule = __decorate([
    Module({
        imports: [TypeOrmModule.forFeature([Conversation, Messages, User]), AuthModule],
        controllers: [ConversationsController],
        providers: [ConversationsServices, ChatGateway],
        exports: [],
    })
], ConversastionsModule);
export { ConversastionsModule };
//# sourceMappingURL=conversations.module.js.map