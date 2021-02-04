import { Exclude, Expose, Type } from 'class-transformer';
import { IsEmail, IsNumber, IsString } from 'class-validator';
import { ReadRoleDto } from '../../role/dtos/read-role.dto';
import { ReadBookDto } from '../../book/dtos/read-book.dto';

@Exclude()
export class ReadUserDto {
  @IsNumber()
  @Expose()
  readonly id: number;

  @Expose()
  @IsEmail()
  readonly email: string;

  @Expose()
  @IsString()
  readonly username: string;

  @Expose()
  @Type((type) => ReadRoleDto)
  readonly roles: ReadRoleDto[];
}
