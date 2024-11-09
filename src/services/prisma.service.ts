import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async isUniqueUser(email: string, nickname: string) {
    const user = await this.user.findFirst({
        where: {
            OR: [
                {email}, {nickname}
            ]
        }
    })
    return user === null
}
}