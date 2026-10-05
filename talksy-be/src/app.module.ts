import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module.js';
import { UserModule } from './user/user.module.js';
import { ConversastionsModule } from './conversations/conversations.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}),
    TypeOrmModule.forRootAsync({
      imports:[ConfigModule],
      inject:[ConfigService],

      useFactory: (configService: ConfigService) => ({
        type: 'postgres',

        url:configService.get<string>("DB_URL"),

        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    AuthModule,
    UserModule,
    ConversastionsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
