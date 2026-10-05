import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Conversation } from '../../conversations/entities/conversation.js';
import { Messages } from '../../conversations/entities/messages.js';

export const rolesEnum = ['admin', 'user'];

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: true })
  name: string;

  @Index({ unique: true })
  @Column({ type: 'text', nullable: false })
  email: string;

  @Column({ type: 'text', nullable: false })
  password: string;

  @Column({ type: 'enum', enum: rolesEnum, nullable: false })
  role: string;

  @ManyToMany(() => Conversation, (c) => c.users)
  conversations: Conversation[];

  @OneToMany(() => Messages, (m) => m.sender)
  messages: Messages[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
