import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto, ReadRoleDto, UpdateRoleDto } from './dtos';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Role Endpoints')
@Controller('roles')
export class RoleController {
  constructor(private readonly _roleService: RoleService) {}

  @Get(':roleId')
  getRole(@Param('roleId', ParseIntPipe) roleId: number): Promise<ReadRoleDto> {
    return this._roleService.get(roleId);
  }

  @Get()
  getRoles(): Promise<ReadRoleDto[]> {
    return this._roleService.getAll();
  }

  @Post()
  createRole(@Body() role: CreateRoleDto): Promise<ReadRoleDto> {
    return this._roleService.create(role);
  }

  @Patch(':roleId')
  updateRole(
    @Param('roleId', ParseIntPipe) roleId: number,
    @Body() role: UpdateRoleDto,
  ): Promise<ReadRoleDto> {
    return this._roleService.update(roleId, role);
  }

  @Delete(':roleId')
  async deleteRole(
    @Param('roleId', ParseIntPipe) roleId: number,
  ): Promise<void> {
    await this._roleService.delete(roleId);
  }
}
