import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from 'src/schema/user.schema';
import { CreateUserDto } from './userDtos/Create.dto';
import { HashPassword } from 'src/helper/hashing.helper';
import { ToUserResponse } from 'src/helper/conversion.helper';
import { UserResponse } from './userDtos/Response.dto';
import { UpdateUserDto } from './userDtos/Update.dto';
import { ActivityService } from '../activity/activity.service';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>,private activityService:ActivityService) { }

    async CreateUser(createRequest: CreateUserDto):Promise<UserResponse> {
        
        const user = new this.userModel
            ({ email: createRequest.email, password: await HashPassword(createRequest.password),roles:createRequest.roles })
        
        await user.save()
        return ToUserResponse(user)
    }
    async GetAllUser():Promise<UserResponse[]> {
        const users = await this.userModel.find().populate('profile').exec()
        
        return (await users).map((i)=>ToUserResponse(i))
    }

    async GetUser(id: string): Promise<UserResponse>{
        const user = await this.userModel.findById(id).populate('profile').exec()
        
        if (!user)
            throw new BadRequestException('There is no user with the given id')
        
        return ToUserResponse(user)
    }

    async DeleteUser(id: string): Promise<string>{
        
        const user = await this.userModel.findByIdAndDelete(id).exec();
        if(!user)throw new BadRequestException('No user with the given id is present')
        
        return 'User is deleted'
    }

    async Update(updateRequest: UpdateUserDto,userId:Types.ObjectId) {
        const updatedUser = await this.userModel.findById(updateRequest.id).exec()        

        if (updatedUser) {
            const diffKeys = Object.keys(updateRequest).filter((key) => {
                if (!(key in updatedUser)) return false
                const oldValue = updatedUser[key]
                const newValue = updateRequest[key]
                
                if (Array.isArray(oldValue) && Array.isArray(newValue)) {
                    return oldValue.length!=newValue.length || !oldValue.every((val,i)=>val==newValue[i])
                }

                return oldValue!=newValue
            })
            
            const prevData = {}
            const newData = {}
            
            diffKeys.forEach((key) => {
                if (key != 'password') {                    
                    prevData[key] = updatedUser[key]
                    newData[key]=updateRequest[key]
                }
            })

            updatedUser.email = updateRequest.email
            updatedUser.password = await HashPassword(updateRequest.password)
            updatedUser.roles = updateRequest.roles
            
            const finalUser = await this.userModel.
                findByIdAndUpdate(updatedUser.id, updatedUser, { new: true }).exec()
            
            if (!finalUser) throw new BadRequestException('Couldnot update data')
            
            this.activityService.logActivity(userId,prevData,newData)
            return ToUserResponse(finalUser)    
        }
        throw new BadRequestException("Couldn't find user with the given id")
    }

    async FindByEmail(email: string){
        const user = await this.userModel.findOne({ email: email }).exec()
        return user
    }

}
