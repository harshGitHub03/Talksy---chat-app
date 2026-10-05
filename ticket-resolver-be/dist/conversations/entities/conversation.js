var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, } from 'typeorm';
import { User } from '../../user/entities/user.js';
import { Messages } from './messages.js';
export const CONVERSATION_TYPES_ENUM = {
    direct: "direct",
    group: "group"
};
let Conversation = class Conversation {
    id;
    type;
    users;
    messages;
    createdAt;
    updatedAt;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Conversation.prototype, "id", void 0);
__decorate([
    Column({ type: "enum", enum: CONVERSATION_TYPES_ENUM }),
    __metadata("design:type", String)
], Conversation.prototype, "type", void 0);
__decorate([
    ManyToMany(() => User, (u) => u.conversations),
    JoinTable(),
    __metadata("design:type", Array)
], Conversation.prototype, "users", void 0);
__decorate([
    OneToMany(() => Messages, (m) => m.conversation),
    __metadata("design:type", Array)
], Conversation.prototype, "messages", void 0);
__decorate([
    CreateDateColumn({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Conversation.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Conversation.prototype, "updatedAt", void 0);
Conversation = __decorate([
    Entity()
], Conversation);
export { Conversation };
//# sourceMappingURL=conversation.js.map