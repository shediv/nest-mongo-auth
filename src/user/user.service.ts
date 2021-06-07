import { Injectable, NotFoundException, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from './user.model';
import { ErrorConstants } from '../constants/error.constant';
import { AppConst } from '../constants/app.constant'

@Injectable()
export class UserService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
    ) {}

    async checkEmailRegistered(emailAddress: string): Promise<User> {
        let userInfo = await this.userModel.findOne({email: emailAddress }, { isActive: 0 }).exec();        
        return userInfo;
    }
    
    private async findUser(id: string): Promise<User> {
        let userInfo;
        try {
            userInfo = await this.userModel.findOne({_id: id }, { password: 0, isActive: 0 }).exec();
        } catch (error) {
          throw new NotFoundException(ErrorConstants.NO_USER_FOUND);
        }
        if (!userInfo || userInfo.length < 1) {
          throw new NotFoundException(ErrorConstants.NO_USER_FOUND);
        }
        return userInfo;
    }

    async findOne(query): Promise<User> {
        return await this.userModel.findOne(query);
    }
    
    async signUp(userData: any): Promise<User> {
        const { firstName, lastName, email, phoneNumber, dob, picture, password } = userData;

        // Check if user already registered with email
        const prevData = await this.checkEmailRegistered(email);
        if (prevData) {
            throw new HttpException(`${ErrorConstants.EMAIL_ALREADY_USED.message} : ${email} and userId : ${prevData.id}`, 500);
        } else {
            const newUser = new this.userModel({
                firstName,
                lastName,
                email,
                phoneNumber,
                dob,
                picture,
                password,
                isActive: true
              });
            const result = await newUser.save();
            return result;
        }
    }

    async getUserDetails(id: string): Promise<User> {
        // Check if User by ID already exist
        const task = await this.findUser(id);
        return task;
    }

    async getAllTasks() {
        const tasks = await this.userModel.find({ }).exec();
        return tasks;
    }

    async deleteUserById(id: string): Promise<any> {
        const result = await this.userModel.deleteOne({_id: id}).exec();
        if (result.n === 0) {
            throw new NotFoundException(ErrorConstants.NO_USER_FOUND);
        }
        return result;
    }

    async deleteUserInfo(id: string, deleteData: any): Promise<any> {
        const currentUserData = await this.findUser(id);
        if (currentUserData) {
            if(deleteData?.deleteField && AppConst.DELETE_ALLOWED_ON.includes(deleteData.deleteField)) {
                let fieldToDelete = deleteData.deleteField;                
                const updatedUserData = await this.userModel.updateOne({_id: id}, { $unset: { [deleteData.deleteField]: 1 } }).exec();
                return updatedUserData;
            } else {
                throw new NotFoundException(ErrorConstants.DELETE_NOT_ALLOWED);
            }
        } else {
            throw new NotFoundException(ErrorConstants.NO_USER_ID_FOUND);
        }
    }

    async updateUserPassword(id: string, updatedUserInfo: string): Promise<User> {
        // Check if User by ID already exist
        const userUpdateData = await this.findUser(id);

        // Update user info
        if(updatedUserInfo) userUpdateData.password = updatedUserInfo;
        const result = await userUpdateData.save();
        return result;
    }
}
