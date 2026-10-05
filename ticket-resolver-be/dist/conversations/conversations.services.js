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
var _a, _b, _c;
import { Injectable, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.js';
import { Repository } from 'typeorm';
import { Conversation, CONVERSATION_TYPES_ENUM } from './entities/conversation.js';
import { Messages } from './entities/messages.js';
let ConversationsServices = class ConversationsServices {
    User;
    Conversation;
    Messages;
    constructor(User, Conversation, Messages) {
        this.User = User;
        this.Conversation = Conversation;
        this.Messages = Messages;
    }
    async upsertConversation(currentUserId, otherUserId) {
        console.log(currentUserId, "   ", otherUserId);
        const conversation = await this.Conversation.createQueryBuilder("conversation")
            .innerJoinAndSelect("conversation.users", "user1")
            .innerJoinAndSelect("conversation.users", "user2")
            .where("conversation.type=:type", { type: CONVERSATION_TYPES_ENUM.direct })
            .andWhere("user1.id=:currentUid AND user2.id=:otherUid", {
            currentUid: currentUserId,
            otherUid: otherUserId
        }).getOne();
        console.log(conversation);
        if (conversation)
            return conversation;
        return this.Conversation.save({
            type: CONVERSATION_TYPES_ENUM.direct,
            users: [{ id: currentUserId }, { id: otherUserId }]
        });
    }
    async listMessages({ conversationId, skip, limit }) {
        const messages = await this.Messages.find({
            where: {
                conversation: { id: conversationId },
            },
            select: {
                sender: {
                    id: true
                }
            },
            relations: {
                sender: true
            },
            skip,
            take: limit,
            order: {
                createdAt: "DESC"
            }
        });
        const ttlMsgCount = await this.Messages.count({
            where: {
                conversation: { id: conversationId },
            }
        });
        console.log(skip + messages.length < ttlMsgCount);
        console.log(skip + messages.length);
        console.log(typeof skip);
        console.log(typeof messages.length);
        return {
            success: true,
            messages,
            ttlMsgCount,
            hasMore: skip + messages.length < ttlMsgCount,
            skip,
            limit
        };
    }
};
ConversationsServices = __decorate([
    Injectable(),
    __param(0, InjectRepository(User)),
    __param(1, InjectRepository(Conversation)),
    __param(2, InjectRepository(Messages)),
    __metadata("design:paramtypes", [typeof (_a = typeof Repository !== "undefined" && Repository) === "function" ? _a : Object, typeof (_b = typeof Repository !== "undefined" && Repository) === "function" ? _b : Object, typeof (_c = typeof Repository !== "undefined" && Repository) === "function" ? _c : Object])
], ConversationsServices);
export { ConversationsServices };
//# sourceMappingURL=conversations.services.js.map