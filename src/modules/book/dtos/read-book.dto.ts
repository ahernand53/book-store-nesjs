import { Exclude, Expose, Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { ReadUserDto } from '../../user/dtos/read-user.dto';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class ReadBookDto {
  @ApiProperty()
  @Expose()
  @IsNumber()
  readonly id: number;

  @ApiProperty()
  @Expose()
  @IsString()
  readonly name: string;

  @ApiProperty()
  @Expose()
  @IsString()
  readonly description: string;

  @Expose()
  @Type((type) => ReadUserDto)
  readonly authors: ReadUserDto[];
}
