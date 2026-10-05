import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, ParseUUIDPipe, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/guards/auth.guard.js";
import type { AuthedRequest } from "../auth/guards/auth.guard.js";
import { UserServices } from "./user.services.js";
import { createUserDto } from "./ctos/createDto.js";
import { AdminGuard } from "../auth/guards/admin.guard.js";
import { Roles } from "../auth/metadata/setRole.js";
import { updateDto } from "./ctos/updateDto.js";


@Controller("user")
export class UserController{
    constructor(
        private userService:UserServices
    ){}

    @Get("me")
    @UseGuards(AuthGuard)
    async me(@Req() req:AuthedRequest){
        return await this.userService.findById(req.user.userId)
    }

    @Get("contacts")
    @UseGuards(AuthGuard)
    async contacts(
        @Req() req:AuthedRequest,
        @Query("page", new DefaultValuePipe(1), ParseIntPipe) page:number,
        @Query("limit", new DefaultValuePipe(20), ParseIntPipe) limit:number,
        @Query("search") search?:string
    ){
        return await this.userService.contacts(req.user.userId,{page,limit,search})
    }

    //admin cruds
    @UseGuards(AdminGuard)
    @Roles(["admin"])
    @Post("create")
    async createUser(@Body() body:createUserDto){
      return await this.userService.createUser(body)
    }

    @UseGuards(AdminGuard)
    @Roles(["admin"])
    @Get("all")
    async all(
        @Query("page", new DefaultValuePipe(1), ParseIntPipe) page:number,
        @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit:number,
        @Query("search") search?:string
    ){
      return await this.userService.all({page,limit,search})
    }

    @UseGuards(AdminGuard)
    @Roles(["admin"])
    @Patch(":userId")
    async update(
        @Param("userId", ParseUUIDPipe) userId :string,
        @Body() body:updateDto
    ){
      return await this.userService.updateOne(userId,body)
    }

    @UseGuards(AdminGuard)
    @Roles(["admin"])
    @Delete(":userId")
    async delete(@Param("userId", ParseUUIDPipe) userId:string){
      return await this.userService.deleteOne(userId)
    }
}
