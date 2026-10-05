var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, CreateDateColumn, Entity, Index, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, } from 'typeorm';
import { Conversation } from '../../conversations/entities/conversation.js';
import { Messages } from '../../conversations/entities/messages.js';
export const rolesEnum = ['admin', 'user'];
let User = class User {
    id;
    name;
    email;
    password;
    role;
    conversations;
    messages;
    createdAt;
    updatedAt;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    Index({ unique: true }),
    Column({ type: 'text', nullable: false }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    Column({ type: 'text', nullable: false }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    Column({ type: 'enum', enum: rolesEnum, nullable: false }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    ManyToMany(() => Conversation, (c) => c.users),
    __metadata("design:type", Array)
], User.prototype, "conversations", void 0);
__decorate([
    OneToMany(() => Messages, (m) => m.sender),
    __metadata("design:type", Array)
], User.prototype, "messages", void 0);
__decorate([
    CreateDateColumn({ type: 'timestamp' }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn({ type: 'timestamp' }),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
User = __decorate([
    Entity()
], User);
export { User };
//# sourceMappingURL=user.js.map