var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, MinLength } from "class-validator";
import { rolesEnum } from "../entities/user.js";
export class createUserDto {
    name;
    email;
    password;
    role;
}
__decorate([
    IsOptional(),
    __metadata("design:type", String)
], createUserDto.prototype, "name", void 0);
__decorate([
    IsEmail(),
    IsNotEmpty(),
    __metadata("design:type", String)
], createUserDto.prototype, "email", void 0);
__decorate([
    MinLength(4),
    IsNotEmpty(),
    __metadata("design:type", String)
], createUserDto.prototype, "password", void 0);
__decorate([
    IsEnum(rolesEnum),
    IsNotEmpty(),
    __metadata("design:type", String)
], createUserDto.prototype, "role", void 0);
//# sourceMappingURL=createDto.js.map