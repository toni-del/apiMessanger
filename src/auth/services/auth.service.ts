import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { Prisma, User } from "@prisma/client";
import * as argon2 from 'argon2'
import { NonValidatedUser } from "src/types/NotValidatedUser";
import { PrismaService } from "../../services/prisma.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService
    ) {}

    async registerUser(first_name: string, last_name: string, email: string, nickname: string, password: string): Promise<{accesToken: string}> {
        if (! await this.prismaService.isUniqueUser(email, nickname)) {
            throw new BadRequestException("user with this email or nickname already exist")
        }
        
        const newUser: NonValidatedUser = {
            first_name,
            last_name,
            email,
            nickname,
            password
        }

        const validationErrors: string[] = this.validateUser(newUser)

        if (validationErrors.length > 0) {
            throw new BadRequestException(validationErrors.join(", "))
        }

        const passwordHash: string = await this.hashPassword(password)

        const registredUser = await this.prismaService.user.create({
            data: {
                first_name,
                last_name,
                email,
                nickname,
                password: passwordHash
            }
        })

        const payload = {sub: registredUser.id, username: registredUser.nickname}

        return {
            accesToken: await this.jwtService.signAsync(payload)
        }
    }

    async loginUser(email: string, password: string): Promise<{accesToken: string}> {
        const validationErrors: string[] = this.validateLoginData(email, password)

        if (validationErrors.length > 0) {
            throw new BadRequestException(validationErrors.join(", "))
        }

        const notAuthUser = await this.prismaService.user.findFirst({
            where: {
                email
            }
        })

        if (notAuthUser === null) {
            throw new BadRequestException("uncorrect email")
        }

        if (await this.verifyPassword(notAuthUser.password, password)) {
            const payload = {sub: notAuthUser, username: notAuthUser.nickname}
            return {
                accesToken: await this.jwtService.signAsync(payload)
            }
        } else {
            throw new BadRequestException("uncorrect password")
        }
    }

    private async hashPassword(plainPassword: string) : Promise<string> {
        return await argon2.hash(plainPassword)
    }

    private async verifyPassword(hashedPass: string, plainPass: string): Promise<boolean> {
        return await argon2.verify(hashedPass, plainPass)
    }

    private validateUser(user: NonValidatedUser): string[] {
        const errors: string[] = []

        const nameRegex = /^[a-zA-Zа-яА-Я]+$/;
        if (!nameRegex.test(user.first_name)) {
            errors.push("First name must contain only letters (English or Russian).");
        }
        if (!nameRegex.test(user.last_name)) {
            errors.push("Last name must contain only letters (English or Russian).");
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(user.email)) {
            errors.push("Invalid email format.");
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
        if (!passwordRegex.test(user.password)) {
            errors.push("Password must contain at least one letter, one number, one special character and be at least 6 characters long.");
        }

        const nicknameRegex = /^[a-zA-Z0-9]+$/;
        if (!nicknameRegex.test(user.nickname)) {
            errors.push("Nickname must contain only letters and numbers.");
        }


        return errors
    }

    private validateLoginData(email: string, password: string) {
        const errors: string[] = []

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            errors.push("Invalid email format.");
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
        if (!passwordRegex.test(password)) {
            errors.push("Password must contain at least one letter, one number, one special character and be at least 6 characters long.");
        }

        return errors
    }

    
}