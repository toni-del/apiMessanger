import { Controller, Get, Put, Query, UseGuards, Request, Body, ParseIntPipe, UseInterceptors, UploadedFile, BadRequestException } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { UpdateProfileDto } from "src/dto/updateProfileDto";
import { ProfileService } from "src/users/services/profile.service";

@ApiTags("Users")
@Controller("users")
export class UsersController {
    constructor(
        private readonly profileService: ProfileService
    ) {}

    @Get()
    @ApiOperation({summary: "Get user profile data"})
    @ApiResponse({status: 200, description: "User profile has been sended"})
    getProfile(@Query('id', ParseIntPipe) id: number) {
        return this.profileService.getProfile(id)
    }

    @UseGuards(JwtAuthGuard)
    @Put('avatar')
    @UseInterceptors(FileInterceptor('avatar', {
    storage: diskStorage({
      destination: './uploads/avatars',
      filename: (req, file, callback) => {
        const uniqueSuffix = `${uuidv4()}-${file.originalname}`;
        callback(null, uniqueSuffix);
      },
    }),
    fileFilter: (req, file, callback) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
        return callback(new BadRequestException('Only image files with extensions jpg|jpeg|png are allowed!'), false);
      }
      callback(null, true);
    },
    }))
    @ApiOperation({summary: "Update user profile avatar"})
    @ApiResponse({status: 200, description: "User profile avatar has been updated succesfuly"})
    async uploadAvatar(@UploadedFile() file: Express.Multer.File, @Request() req) {
        if (!file) {
            throw new BadRequestException("no file uploaded")
        }
        const userId = req.user.id;
        const filePath = `/uploads/avatars/${file.filename}`;
        const updatedUserInfo = await this.profileService.updateAvatar(userId, filePath);
        return { message: 'Avatar uploaded successfully', updatedUserInfo};
    }


    @UseGuards(JwtAuthGuard)
    @Put()
    @ApiOperation({summary: "Update user profile"})
    @ApiResponse({status: 200, description: "User profile has been updated succesfuly"})
    updateProfile(
        @Request() req: any,
        @Body() updProfileDto: UpdateProfileDto
    ) {
        return this.profileService.updateProfile(updProfileDto, req.user.id)
    }

    
}