// import { BadRequestException, Injectable } from "@nestjs/common";
// import { Profile } from "src/types/profile";
// import { PrismaService } from "./prisma.service";
// import { Prisma, User } from "@prisma/client";
// import { UpdateProfileInput } from "src/types/UpdateProfileInput";

// @Injectable()
// export class ProfileService {
//     constructor(
//         private readonly prismaService: PrismaService
//     ) {}

//     async getProfile(id: number): Promise<Profile> {
//         const user: User = await this.prismaService.user.findFirst({
//             where: {
//                 id
//             }
//         })
        
//         return this.convertUserToProfile(user)
//     }

//     async updateProfile(payload: UpdateProfileInput): Promise<Profile> {
//         if (payload.email || payload.nickname) {
//             const isUnique: boolean = await this.prismaService.isUniqueUser(payload.email, payload.nickname)
//             if (!isUnique) {
//                 throw new BadRequestException("user with this email or nickname already exist")
//             }
//         }

//         const filteredPayload = this.filterNonEmptyFields(payload)

//         const updatedUser: User = this.prismaService.user.update({
//             where
//         })
//         const updatedProfile: Profile = this.convertUserToProfile()
//     }

//     filterNonEmptyFields(payload: UpdateProfileInput): Partial<UpdateProfileInput> {
//         const filteredPayload: Partial<UpdateProfileInput> = {}

//         for (const key in payload) {
//             if (payload[key]) {
//                 filteredPayload[key] = payload[key]
//             }
//         }

//         return filteredPayload
//     }

//     convertUserToProfile(user: User): Profile {
//         return {
//             id: user.id,
//             first_name: user.first_name,
//             last_name: user.last_name,
//             email: user.email,
//             nickname: user.nickname,
//             avatar: user.avatar,
//             bio: user.bio
//         }
//     }
// }