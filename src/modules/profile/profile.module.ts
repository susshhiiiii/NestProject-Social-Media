import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Profile, ProfileSchema } from 'src/schema/profile.schema';
import { UserModule } from 'src/modules/user/user.module';
import { User, UserSchema } from 'src/schema/user.schema';

@Module({
  imports:[MongooseModule.forFeature([{name:Profile.name,schema:ProfileSchema},{name:User.name,schema:UserSchema}]),UserModule],
  controllers: [ProfileController],
  providers: [ProfileService]
})
export class ProfileModule {}
