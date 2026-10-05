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
import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ConversationsServices } from "./conversations.services.js";
import { AuthGuard, CurrentUser } from "../auth/guards/auth.guard.js";
let ConversationsController = class ConversationsController {
    conversationServices;
    constructor(conversationServices) {
        this.conversationServices = conversationServices;
    }
    async getConversation(currentUser, otherUserId) {
        console.log(currentUser);
        return await this.conversationServices.upsertConversation(currentUser.userId, otherUserId);
    }
    async listMessages(query) {
        const { conversationId, skip, limit } = query;
        return await this.conversationServices.listMessages({
            conversationId,
            limit: Number(limit),
            skip: Number(skip),
        });
    }
};
__decorate([
    UseGuards(AuthGuard),
    Get("direct"),
    __param(0, CurrentUser()),
    __param(1, Query("otherUserId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ConversationsController.prototype, "getConversation", null);
__decorate([
    Get("list/messages"),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ConversationsController.prototype, "listMessages", null);
ConversationsController = __decorate([
    Controller("conversations"),
    __metadata("design:paramtypes", [ConversationsServices])
], ConversationsController);
export { ConversationsController };
//# sourceMappingURL=conversations.controller.js.map