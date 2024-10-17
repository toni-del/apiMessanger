import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { Prisma, User } from "@prisma/client";
import * as argon2 from 'argon2'
import { NonValidatedUser } from "src/types/NotValidatedUser";
import { PrismaService } from "./prisma.service";

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService
    ) {}

    async registerUser(first_name: string, last_name: string, email: string, nickname: string, password: string) {
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

        return this.prismaService.user.create({
            data: {
                first_name,
                last_name,
                email,
                nickname,
                password: passwordHash
            }
        })
    }

    async loginUser(email: string, password: string) {
        const validationErrors: string[] = this.validateLoginData(email, password)

        if (validationErrors.length > 0) {
            throw new BadRequestException(validationErrors.join(", "))
        }

        const passwordHash: string = await this.hashPassword(password)

        return this.prismaService.user.findFirst({
            where: {
                email,
                password: passwordHash
            }
        })
    }

    private async hashPassword(plainPassword: string) : Promise<string> {
        return await argon2.hash(plainPassword)
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