import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Petro Petruk', description: 'user name' })
  readonly name: string;

  @ApiProperty({ example: 'user@gmail.com', description: 'user email' })
  readonly email: string;

  @ApiProperty({ example: '12345678', description: 'user password' })
  readonly password: string;

  readonly activationLink: string;
}
