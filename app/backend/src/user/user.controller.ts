import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express'
import { UserService } from './user.service'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from '@prisma/client'

@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  // JWTを使用してユーザー情報の認証を行う場合、Cookieを使用するやシークレットキーが何であるかをオプションとして設定するために、ストラテジーファイルを用いる

  @Get()
  async getLoginUser(@Req() req: Request): Promise<Omit<User, 'hashedPassword'>> {
    // もともとhashedPasswordプロパティがないレスポンスを返しているため、リクエストには含まれない
    // そのため、リクエストのExpressのユーザーモデルとスキーマで定義したユーザーモデルで競合が起きてしまい、次のエラーが発生する。
    // 型 'User' には 型 'Omit<User, "hashedPassword">' からの次のプロパティがありません: id, createdAt, updatedAt, email, nickName
    // そのため、別途データ型ファイルを用意する
    return req.user
  }

  @Patch()
  async updateUser(
    @Req() req: Request,
    @Body() dto: UpdateUserDto,
  ): Promise<Omit<User, 'hashedPassword'>> {
    return await this.userService.updateUser(req.user.id, dto)
  }
}
