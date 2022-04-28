import { ApiProperty } from '@nestjs/swagger';

export class AddUserRoleDto {
  @ApiProperty({
    example: 'Petro Petruk',
    description: 'user id from db document users',
  })
  readonly userId: string;

  @ApiProperty({
    example: '"admin", "traveller", "tourist" or "company"',
    description: 'name of role like in db roles',
  })
  readonly roleName: string;
}
