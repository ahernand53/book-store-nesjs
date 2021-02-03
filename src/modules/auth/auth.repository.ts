import { EntityRepository, getConnection, Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { SignupDto } from './dto/signup.dto';
import { RoleRepository } from '../role/role.repository';
import { Role } from '../role/role.entity';
import { RoleType } from '../role/roletype.enum';
import { genSalt, hash } from 'bcryptjs';

@EntityRepository(User)
export class AuthRepository extends Repository<User> {
  async signup({ username, email, password }: SignupDto) {
    const user = new User();
    user.username = username;
    user.email = email;
    user.roles = [await this.getDefaultRole()];

    const salt = await genSalt(10);
    user.password = await hash(password, salt);

    await user.save();
  }

  private async getDefaultRole(): Promise<Role> {
    const roleRepository: RoleRepository = getConnection().getRepository(Role);

    return await roleRepository.findOne({ where: { name: RoleType.GENERAL } });
  }
}
