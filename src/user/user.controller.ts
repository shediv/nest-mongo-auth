import { 
    BadRequestException, 
    Body, 
    Controller, 
    Delete, 
    Get, 
    Param, 
    Patch, 
    Post, 
    Query, 
    UsePipes, 
    ValidationPipe, 
    UseInterceptors, 
    UploadedFile, 
    NotFoundException,
    HttpException } from '@nestjs/common';
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from  'multer';
import { extname } from  'path';
import { UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { AddUserDto } from './dto/add-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ErrorConstants } from '../constants/error.constant';
import { Compare, Hash } from './helper/bcrypt.service';
import { mongooseId, parseToId } from './helper/mongoose.service';
import { JwtAuthGuard } from '../auth/auth.resolver';

@Controller('user')
export class UserController {
    constructor (
        private userService: UserService,
        private readonly authService: AuthService
    ) {}

    @Post('signup')
    @UsePipes(ValidationPipe)
    @UseInterceptors(FileInterceptor('picture',
            {
                storage: diskStorage({
                destination: './uploads', 
                filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
                return cb(null, `${randomName}${extname(file.originalname)}`)
                }
                })
            }
        )
    )
    async signUpUser(@UploadedFile() picture: Express.Multer.File, @Body() addUserData: AddUserDto) {
        if (!picture) {
            throw new BadRequestException(ErrorConstants.CREATE_REQ_FIELD_ERROR);
        }

        const hashedPassword = await Hash(addUserData.password);
        let userInfo = {
            firstName: addUserData.firstName,
            lastName: addUserData.lastName,
            email: addUserData.email,
            phoneNumber: addUserData.phoneNumber,
            dob: addUserData.dob,
            picture: `${picture.filename}`,
            password: hashedPassword
        };
        return this.userService.signUp(userInfo);
    }
 
    @Post('signin')
    @UsePipes(ValidationPipe)
    async login(@Body() loginData: LoginUserDto) {
        const { email } = loginData;
        const result = await this.userService.checkEmailRegistered(email);
        if (!result) throw new NotFoundException(ErrorConstants.NO_USER_FOUND);
    
        const { password, _id } = result;
        const user = parseToId(result);
        const verify = await Compare(loginData.password, password);
        if (verify) {
            delete user.password;
            return { ...user, token: await this.authService.jwtSign(_id) };
        } else {
            throw new HttpException(ErrorConstants.WRONG_PASSWORD, 401);
        }
    }

    // @Get()
    // async getTasks(
    //     @Query(ValidationPipe) filterDto: any
    // ) {
    //     if(filterDto && Object.keys(filterDto).length) {
    //         const tasks = await this.userService.getTasksWithFilters(filterDto);
    //         return tasks;
    //     } else {
    //         const tasks = await this.userService.getAllTasks();
    //         return tasks;
    //     }       
    // }

    @UseGuards(JwtAuthGuard)
    @Get('details/:id')
    getUserDetails(@Param('id') id:string) {
        return this.userService.getUserDetails(id);
    }

    // @Patch('/:id')
    // @UsePipes(ValidationPipe)
    // @UseInterceptors(FileInterceptor('media',
    //         {
    //             storage: diskStorage({
    //             destination: './uploads', 
    //             filename: (req, file, cb) => {
    //             const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
    //             return cb(null, `${randomName}${extname(file.originalname)}`)
    //             }
    //             })
    //         }
    //     )
    // )
    // updateTask(@UploadedFile() media: Express.Multer.File, @Param('id') taskId: string, @Body() updateTaskDto: UpdateTaskDto) {
    //     let taskUpdatedata: any = updateTaskDto;
    //     if (taskId) {
    //         taskUpdatedata.id = taskId;

    //         // if media is present then add media
    //         if(media) taskUpdatedata.media = `${media.destination}/${media.filename}`;
    //         return this.userService.updateTask(taskUpdatedata);

    //     } else {
    //         throw new BadRequestException(ErrorConstants.UPDATE_TASK_ID_REQ);
    //     }
    // }

    @Delete('delete/:id')
    deleteUserProfile(@Param('id') id:string) {   
        return this.userService.deleteUserById(id);        
    }
}
