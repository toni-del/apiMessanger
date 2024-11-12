import { UserBio } from "@prisma/client"
import { BioFront } from "./BioFront"

export type Profile = {
    id: number,
    first_name: string,
    last_name: string,
    email: string,
    nickname: string,
    avatar: string,
    bio: UserBio[]
}