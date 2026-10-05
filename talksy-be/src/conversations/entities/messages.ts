import {
    Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { User } from '../../user/entities/user.js';
import { Conversation } from './conversation.js';

@Entity()
export class Messages {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type:"text"})
  content:string

  // Relation<> keeps decorator metadata from touching User at import time (circular ESM import)
  @ManyToOne(()=>User,(u)=>u.messages)
  sender:Relation<User>

  @ManyToOne(() => Conversation, (c) => c.messages)
  conversation: Relation<Conversation>;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
