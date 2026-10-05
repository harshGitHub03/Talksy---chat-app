import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.js';
import { Repository } from 'typeorm';
import { Conversation, CONVERSATION_TYPES_ENUM } from './entities/conversation.js';
import { Messages } from './entities/messages.js';

@Injectable()
export class ConversationsServices {
  constructor(
    @InjectRepository(User)
    private readonly User:Repository<User>,
  
    @InjectRepository(Conversation)
    private readonly Conversation:Repository<Conversation>,
  
    @InjectRepository(Messages)
    private readonly Messages:Repository<Messages>
  ){}

  //direct
  async upsertConversation(currentUserId:string,otherUserId:string){
    console.log(currentUserId,"   ",otherUserId)
    const conversation=await this.Conversation.createQueryBuilder("conversation")
      .innerJoinAndSelect("conversation.users","user1")
      .innerJoinAndSelect("conversation.users","user2")
      .where("conversation.type=:type",{type:CONVERSATION_TYPES_ENUM.direct})
      .andWhere("user1.id=:currentUid AND user2.id=:otherUid",{
        currentUid:currentUserId,
        otherUid:otherUserId
      }).getOne()
    
    console.log(conversation)
    if(conversation)
      return conversation

    return this.Conversation.save({
      type:CONVERSATION_TYPES_ENUM.direct,
      users:[{id:currentUserId},{id:otherUserId}]
    })
  }

  async listMessages({conversationId,skip,limit}:{
    conversationId:string,
    skip:number,
    limit:number
  }){
    const messages=await this.Messages.find({
      where:{
        conversation:{id:conversationId},
      },
      select:{
        sender:{
          id:true
        }
      },
      relations:{
        sender:true
      },
      skip,
      take:limit,
      order:{
        createdAt:"DESC"
      }
    })

    const ttlMsgCount = await this.Messages.count({
      where:{
        conversation:{id:conversationId},
      }
    })

    console.log(skip + messages.length < ttlMsgCount)
    console.log(skip + messages.length )
    console.log(typeof skip)
    console.log(typeof messages.length )

    return {
      success:true,
      messages,
      ttlMsgCount,
      hasMore:skip + messages.length < ttlMsgCount,
      skip,
      limit
    }
  }
}
