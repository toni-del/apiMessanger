import { BioFront } from "./BioFront"

export type UpdateProfileInput = {
    first_name?: string,
    last_name?: string,
    email?: string,
    nickname?: string,
    avatar?: string,
    bio?: BioFront
}