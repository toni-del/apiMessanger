import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { LoginUserDto } from "src/dto/loginUserDto";
import { RegisterUserDto } from "src/dto/regisreUserDto";
import { AuthService } from "src/auth/services/auth.service";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @Post("register")
    @ApiOperation({summary: "Validate input data and register user in database"})
    @ApiResponse({status: 200, description: "User has been registred"})
    registerUser(@Body() userDTO: RegisterUserDto) {
        return this.authService.registerUser(userDTO.first_name, userDTO.last_name, userDTO.email, userDTO.nickname, userDTO.password)
    }

    @Post("login")
    @ApiOperation({summary: "Validate input data and find user in database"})
    @ApiResponse({status: 200, description: "User has been finded"})
    loginUser(@Body() userDTO: LoginUserDto) {
        return this.authService.loginUser(userDTO.email, userDTO.password)
    }
}