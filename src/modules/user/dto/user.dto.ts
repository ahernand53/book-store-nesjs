import { IsNotEmpty } from 'class-validator';
import { RoleType } from '../../../modules/role/roletype.enum';
import { UserDetails } from '../user.details.entity';

export class UserDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  email: string;

  // @IsNotEmpty()
  // details: UserDetails;

  @IsNotEmpty()
  roles: RoleType;
}
