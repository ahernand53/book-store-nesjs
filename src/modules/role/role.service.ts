import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleRepository } from './role.repository';
import { Role } from './role.entity';
import { CreateRoleDto, ReadRoleDto, UpdateRoleDto } from './dtos/index';
import { plainToClass } from 'class-transformer';
import { status } from '../../shared/entity-status.num';
import { stat } from 'fs';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleRepository)
    private readonly _roleRepository: RoleRepository,
  ) {}

  async get(id: number): Promise<ReadRoleDto> {
    if (!id) {
      throw new BadRequestException('id must be sent');
    }

    const role: Role = await this._roleRepository.findOne(id, {
      where: { status: status.ACTIVE },
    });

    if (!role) {
      throw new NotFoundException();
    }

    return plainToClass(ReadRoleDto, role);
  }

  async getAll(): Promise<ReadRoleDto[]> {
    const roles: Role[] = await this._roleRepository.find({
      where: { status: status.ACTIVE },
    });

    return roles.map((role: Role) => plainToClass(ReadRoleDto, role));
  }

  async create(role: Partial<CreateRoleDto>): Promise<ReadRoleDto> {
    const savedRole: Role = await this._roleRepository.save(role);
    return plainToClass(ReadRoleDto, savedRole);
  }

  async update(
    roleId: number,
    role: Partial<UpdateRoleDto>,
  ): Promise<ReadRoleDto> {
    const roleExist = await this._roleRepository.findOne(roleId, {
      where: { status: status.ACTIVE },
    });

    if (!roleExist) {
      throw new NotFoundException('this role does not exist');
    }

    roleExist.name = role.name;
    roleExist.description = role.description;

    const updatedRole = await this._roleRepository.save(roleExist);

    return plainToClass(ReadRoleDto, updatedRole);
  }

  async delete(id: number): Promise<void> {
    const roleExist = await this._roleRepository.findOne(id, {
      where: { status: status.ACTIVE },
    });

    if (!roleExist) {
      throw new NotFoundException();
    }

    await this._roleRepository.update(id, { status: status.INACTIVE });
  }
}
