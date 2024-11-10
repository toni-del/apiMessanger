import { BadRequestException, Injectable } from "@nestjs/common";
import { Profile } from "src/types/profile";
import { PrismaService } from "../../services/prisma.service";
import { Prisma, User, UserBio } from "@prisma/client";
import { UpdateProfileConverted, UpdateProfileInput } from "src/types/UpdateProfileInput";
import { BioFront } from "src/types/BioFront";

@Injectable()
export class ProfileService {
    constructor(
        private readonly prismaService: PrismaService
    ) {}

    async getProfile(id: number): Promise<Profile> {
        const user: User = await this.prismaService.user.findFirst({
            where: {
                id: id
            }
        })

        if (user === null) {
            throw new BadRequestException("no user with this id")
        }

        const userBios: UserBio[] = await this.prismaService.userBio.findMany({
            where: {
                userId: id
            }
        })
        
        return this.convertUserToProfile(user, userBios)
    }

    async updateProfile(payload: UpdateProfileInput, userId: number): Promise<Profile> {
        if (payload.email || payload.nickname) {
            const isUnique: boolean = await this.prismaService.isUniqueData(payload.email, payload.nickname)
            if (!isUnique) {
                throw new BadRequestException("user with this email or nickname already exist")
            }
        }

        const convertedPayload: UpdateProfileConverted = this.convertUpdateProfileInput(payload)

        const updatedUser: User = await this.prismaService.user.update({
            where: {
                id: userId
            },
            data: {
                ...convertedPayload
            }
        })
 
        if (payload["bio"]) {
            await this.addBioToDB(payload["bio"], userId)
        }

        const userBios: UserBio[] = await this.prismaService.userBio.findMany({
            where: {
                userId
            }
        })

        const updatedProfile: Profile = this.convertUserToProfile(updatedUser, userBios)
        return updatedProfile
    }

    private convertUpdateProfileInput(payload: UpdateProfileInput): Partial<UpdateProfileConverted> {
        const filteredPayload: Partial<UpdateProfileConverted> = {}

        for (const key in payload) {
            if (payload[key] && key !== "bio") {
                filteredPayload[key] = payload[key]
            }
        }

        return filteredPayload
    }

    private convertUserToProfile(user: User, bio: UserBio[]): Profile {
        return {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            nickname: user.nickname,
            avatar: user.avatar,
            bio
        }
    }

    private async addBioToDB(bios: BioFront, userId: number): Promise<UserBio[]> {
        const addedBios: UserBio[] = []
        for (const key in bios) {
            addedBios.push(await this.prismaService.userBio.upsert({
                where: {
                    userId_jsonKey: {
                        userId,
                        jsonKey: key
                    }
                },
                update: {
                    displayName: bios[key]["name"],
                    value: bios[key]["value"]
                },
                create: {
                    userId: userId,
                    jsonKey: key,
                    displayName: bios[key]["name"],
                    value: bios[key]["value"],
                }
            }))
        }

        return addedBios
    }
}