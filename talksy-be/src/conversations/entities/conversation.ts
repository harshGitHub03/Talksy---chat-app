import {
    Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.js';
import { Messages } from './messages.js';

export const CONVERSATION_TYPES_ENUM={
    direct:"direct",
    group:"group"
}

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type:"enum",enum:CONVERSATION_TYPES_ENUM})
  type:string

  @ManyToMany(() => User, (u) => u.conversations)
  @JoinTable()
  users: User[];

  @OneToMany(() => Messages, (m) => m.conversation)
  messages: Messages[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
