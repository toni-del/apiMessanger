import { IsString, IsEmail, Matches, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsEmail({}, { message: 'Invalid email format.' })
  email: string;

  password: string;
}
