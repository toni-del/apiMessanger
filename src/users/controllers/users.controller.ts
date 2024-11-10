import { Controller, Get, Put, Query, UseGuards, Request, Body, ParseIntPipe } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
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