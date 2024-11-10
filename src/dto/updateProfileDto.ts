import { IsString, IsEmail, Matches, MinLength, IsOptional, ValidateNested } from 'class-validator';
import { BioFront } from 'src/types/BioFront';

export class UpdateProfileDto {
    @IsString()
    @IsOptional()
    @Matches(/^[a-zA-Zа-яА-Я]+$/, { message: 'First name must contain only letters (English or Russian).' })
    first_name?: string;
  
    @IsString()
    @IsOptional()
    @Matches(/^[a-zA-Zа-яА-Я]+$/, { message: 'Last name must contain only letters (English or Russian).' })
    last_name?: string;
  
    @IsEmail({}, { message: 'Invalid email format.' })
    @IsOptional()
    email?: string;
  
    @IsString()
    @IsOptional()
    @Matches(/^[a-zA-Z0-9]+$/, { message: 'Nickname must contain only letters and numbers.' })
    nickname?: string;
  
    @IsString()
    @IsOptional()
    avatar?: string;
  
    @ValidateNested()
    @IsOptional()
    bio?: BioFront;
  }