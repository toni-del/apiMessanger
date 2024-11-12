import { BioFront } from "./BioFront"

export type UpdateProfileInput = {
    first_name?: string,
    last_name?: string,
    email?: string,
    nickname?: string,
    avatar?: string,
    bio?: BioFront
}

export type UpdateProfileConverted = {
    first_name?: string,
    last_name?: string,
    email?: string,
    nickname?: string,
    avatar?: string,
    bio?: string
}