import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AuthServices } from './auth.services.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.js';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from './guards/auth.guard.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '1d',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthServices, AuthGuard],
  exports: [JwtModule, AuthGuard, AuthServices],
})
export class AuthModule {}
