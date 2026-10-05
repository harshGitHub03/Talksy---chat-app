var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from "class-validator";
import { rolesEnum } from "../entities/user.js";
export class updateDto {
    name;
    email;
    password;
    role;
}
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], updateDto.prototype, "name", void 0);
__decorate([
    IsEmail(),
    IsOptional(),
    __metadata("design:type", String)
], updateDto.prototype, "email", void 0);
__decorate([
    IsString(),
    MinLength(4),
    IsOptional(),
    __metadata("design:type", String)
], updateDto.prototype, "password", void 0);
__decorate([
    IsOptional(),
    IsEnum(rolesEnum),
    __metadata("design:type", String)
], updateDto.prototype, "role", void 0);
//# sourceMappingURL=updateDto.js.map