import { Role } from './role.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Role)
export class RoleRepository extends Repository<Role> {}
