import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, ParseUUIDPipe, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ConversationsServices } from "./conversations.services.js";
import { AuthGuard, CurrentUser } from "../auth/guards/auth.guard.js";
import { User } from "../user/entities/user.js";


@Controller("conversations")
export class ConversationsController{

    constructor(private readonly conversationServices:ConversationsServices){}

    @UseGuards(AuthGuard)
    @Get("direct")
    async getConversation(
        @CurrentUser() currentUser:{userId:string},
        @Query("otherUserId") otherUserId:string
    ){
        console.log(currentUser)
        return await this.conversationServices.upsertConversation(currentUser.userId,otherUserId)
    }

    // todo: previews conversastions
    @Get("list/messages")
    async listMessages(
        @Query() query: { conversationId: string; skip?: string | number; limit?: string | number }
    ) {
        const { conversationId, skip, limit } = query;
        return await this.conversationServices.listMessages({
            conversationId,
            limit: Number(limit),
            skip: Number(skip),
        });
    }
}
