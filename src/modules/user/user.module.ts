import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShareModule } from '../../shared/shared.module';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MapperService } from '../../shared/mapper.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository]), ShareModule],
  providers: [UserService, MapperService],
  controllers: [UserController],
})
export class UserModule {}
