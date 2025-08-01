import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import { ProfileModule } from './modules/profile/profile.module';
import { PostModule } from './modules/post/post.module';
import { CommentModule } from './modules/comment/comment.module';
import { AuthModule } from './auth/auth.module';
import { ActivityModule } from './modules/activity/activity.module';
import { JwtService } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/guards/auth.guard';
import { RoleGuard } from './auth/guards/roles.guard';
import { LoginModule } from './modules/login-logmodule/login-logmodule.module';
import { ConfigModule } from '@nestjs/config';
import { ErrorLogModule } from './modules/error-log/error-log.module';
import { EmailService } from './email/email.service';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
     ConfigModule.forRoot({
      isGlobal: true, // So you don't have to import it everywhere
    }),
    MongooseModule.forRoot('mongodb://localhost/social-media'),   
    UserModule, ProfileModule, PostModule, CommentModule, AuthModule, ActivityModule, LoginModule,
    ErrorLogModule,
    EmailModule
  ],
  controllers: [],
  providers: [
    JwtService,
    {
      provide: APP_GUARD,
      useClass:AuthGuard
    },
    {
      provide: APP_GUARD,
      useClass:RoleGuard
    },
    EmailService
  ],
})
export class AppModule {}
