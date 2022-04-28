import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Petro Petruk', description: 'user name' })
  readonly name: string;

  @ApiProperty({ example: 'user@gmail.com', description: 'user email' })
  @IsString({ message: 'Should be a string' })
  @IsEmail({}, { message: 'Invalid email' })
  readonly email: string;

  @ApiProperty({ example: '12345678', description: 'user password' })
  @IsNotEmpty()
  @IsString({ message: 'Should be a string' })
  @Length(4, 16, { message: 'Should be more than 4 and less than 16 signs' })
  readonly password: string;

  readonly activationLink: string;
}
