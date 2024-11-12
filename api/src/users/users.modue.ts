import { Module } from '@nestjs/common';
import { UsersController } from 'src/users/controllers/users.controller';
import { ProfileService } from 'src/users/services/profile.service';
import { PrismaService } from '../services/prisma.service';

@Module({
  controllers: [UsersController],
  providers: [ProfileService, PrismaService],
})
export class UsersModule {}
