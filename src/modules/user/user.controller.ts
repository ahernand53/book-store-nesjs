import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../role/decorators/role.decorator';
import { RoleGuard } from '../role/guards/role.guard';
import { RoleType } from '../role/roletype.enum';

@Controller('users')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Get(':id')
  // @Roles(RoleType.ADMIN)
  // @UseGuards(AuthGuard, RoleGuard)
  async getUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return await this._userService.get(id);
  }

  @UseGuards(AuthGuard())
  @Get()
  async getUsers(): Promise<User[]> {
    return await this._userService.getAll();
  }

  @Post()
  async createUser(@Body() user: User): Promise<User> {
    return await this._userService.create(user);
  }

  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: User,
  ): Promise<void> {
    await this._userService.update(id, user);
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this._userService.delete(id);
  }

  @Post('/setRole')
  async setRoleToUser(
    @Body() { userId, roleId }: { userId: number; roleId: number },
  ) {
    return await this._userService.setRoleToUser(userId, roleId);
  }
}
