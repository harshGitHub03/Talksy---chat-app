var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, } from 'typeorm';
import { User } from '../../user/entities/user.js';
import { Conversation } from './conversation.js';
let Messages = class Messages {
    id;
    content;
    sender;
    conversation;
    createdAt;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Messages.prototype, "id", void 0);
__decorate([
    Column({ type: "text" }),
    __metadata("design:type", String)
], Messages.prototype, "content", void 0);
__decorate([
    ManyToOne(() => User, (u) => u.messages),
    __metadata("design:type", Object)
], Messages.prototype, "sender", void 0);
__decorate([
    ManyToOne(() => Conversation, (c) => c.messages),
    __metadata("design:type", Object)
], Messages.prototype, "conversation", void 0);
__decorate([
    CreateDateColumn({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Messages.prototype, "createdAt", void 0);
Messages = __decorate([
    Entity()
], Messages);
export { Messages };
//# sourceMappingURL=messages.js.map