import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Not, Repository } from 'typeorm';
import { User } from './entities/user.js';
import { createUserDto } from './ctos/createDto.js';
import { updateDto } from './ctos/updateDto.js';
import { AuthServices } from '../auth/auth.services.js';

// Everything except the password hash
const PUBLIC_FIELDS = { id: true, name: true, email: true, role: true, createdAt: true };

@Injectable()
export class UserServices {
  constructor(
    @InjectRepository(User)
    private User: Repository<User>,

    private authServices: AuthServices,
  ) {}

  async findById(id: string) {
    const user = await this.User.findOne({
      where: { id },
      select: PUBLIC_FIELDS,
    });
    // token is valid but the user was deleted
    if (!user) throw new UnauthorizedException();
    return user;
  }

  // People any logged-in user can chat with: everyone but themselves
  async contacts(userId: string, body: { page: number; limit: number; search?: string }) {
    const page = Math.max(1, body.page);
    const limit = Math.min(Math.max(1, body.limit), 50);
    const search = body.search?.trim();

    const notMe = { id: Not(userId) };
    // An array of conditions is OR'ed: name matches or email matches
    const where = search
      ? [
          { ...notMe, name: ILike(`%${search}%`) },
          { ...notMe, email: ILike(`%${search}%`) },
        ]
      : notMe;

    const [users, count] = await this.User.findAndCount({
      where,
      select: { id: true, name: true, email: true },
      order: { name: 'ASC', email: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { users, count, page, limit };
  }

  async createUser(user: createUserDto) {
    const userExist = await this.User.findOne({ where: { email: user.email } });
    if (userExist) throw new BadRequestException('Already exists');
    const password = await this.authServices.hashPassword(user.password);
    const { id } = await this.User.save(this.User.create({ ...user, password }));
    return await this.findById(id);
  }

  async all(body: { page: number; limit: number; search?: string }) {
    const page = Math.max(1, body.page);
    const limit = Math.min(Math.max(1, body.limit), 100);
    const skip = (page - 1) * limit;
    const search = body.search?.trim();

    const [users, count] = await this.User.findAndCount({
      // An array of conditions is OR'ed: name matches or email matches
      where: search
        ? [{ name: ILike(`%${search}%`) }, { email: ILike(`%${search}%`) }]
        : undefined,
      select: PUBLIC_FIELDS,
      order: { createdAt: 'ASC' },
      skip,
      take: limit,
    });

    return {
      users,
      count,
      page,
      limit,
    };
  }

  async updateOne(userId: string, body: updateDto) {
    if (body?.email) {
      const taken = await this.User.findOne({ where: { email: body.email } });
      if (taken && taken.id !== userId) throw new BadRequestException('Already exists');
    }
    if (body?.password)
      body.password = await this.authServices.hashPassword(body.password);
    const result = await this.User.update({ id: userId }, body);
    if (!result.affected) throw new NotFoundException('User not found');
    return await this.findById(userId);
  }

  async deleteOne(userId: string) {
    const result = await this.User.delete({ id: userId });
    if (!result.affected) throw new NotFoundException('User not found');
    return { success: true };
  }
}
