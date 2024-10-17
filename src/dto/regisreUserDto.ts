import { IsString, IsEmail, Matches, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @Matches(/^[a-zA-Zа-яА-Я]+$/, { message: 'First name must contain only letters (English or Russian).' })
  first_name: string;

  @IsString()
  @Matches(/^[a-zA-Zа-яА-Я]+$/, { message: 'Last name must contain only letters (English or Russian).' })
  last_name: string;

  @IsEmail({}, { message: 'Invalid email format.' })
  email: string;

  @IsString()
  @Matches(/^[a-zA-Z0-9]+$/, { message: 'Nickname must contain only letters and numbers.' })
  nickname: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long.' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/, { 
    message: 'Password must contain at least one letter, one number, and one special character.' 
  })
  password: string;
}
