import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from '@prisma/client'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * ユーザー情報を更新する関数オブジェクト
   */
  async updateUser(
    userId: number,
    dto: UpdateUserDto,
  ): Promise<Omit<User, 'hashedPassword'>> {
    const user = this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    })
    delete (await user).hashedPassword
    return user
  }
}
