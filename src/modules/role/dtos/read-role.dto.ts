import { Exclude, Expose } from 'class-transformer';
import { IsNumber, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class ReadRoleDto {
  @Expose()
  @IsNumber()
  readonly id: number;

  @ApiProperty()
  @Expose()
  @IsString()
  @MaxLength(50, { message: 'this name is not valid' })
  readonly name: string;

  @ApiProperty()
  @Expose()
  @IsString()
  @MaxLength(100, { message: 'this name is not valid' })
  readonly description: string;
}
