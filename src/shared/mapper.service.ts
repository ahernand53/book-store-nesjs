import { Injectable } from '@nestjs/common';
import { TypeMapper } from 'ts-mapper';
import { User } from '../modules/user/user.entity';
import { UserDto } from '../modules/user/dto/user.dto';

@Injectable()
export class MapperService extends TypeMapper {
  constructor() {
    super();
    this.config();
  }

  private config(): void {
    this.createMap<User, UserDto>()
      .map(
        (entity) => entity.id,
        (dto) => dto.id,
      )
      .map(
        (entity) => entity.username,
        (dto) => dto.username,
      )
      .map(
        (entity) => entity.email,
        (dto) => dto.email,
      )
      .map(
        (entity) => entity.roles,
        (dto) => dto.roles,
      );
    // .map(
    //   (entity) => entity.details,
    //   (dto) => dto.details,
    // )
  }
}
