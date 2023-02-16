import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  Req,
  Get,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { AuthService } from './auth.service'
import { AuthDto } from './dto/auth.dto'
import { Csrf, Msg } from './interfaces/auth.interface'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // BodyデコレーターでHTTPリクエストボディに存在するデータを取得する
  @Post('signup')
  signUp(@Body() dto: AuthDto): Promise<Msg> {
    return this.authService.signUp(dto)
  }

  // NestJSではHTTPステータスがPOSTメソッドは201、それ以外全て201で返されてしまう
  // 適宜HttpCodeデコレーターを使用してステータスコードを変更する
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() dto: AuthDto,
    // NestJSのリクエストハンドラーはデフォルトで返り値をJSONに初期化する。しかし、@Resや@Nextデコレーターを使用するとこの機能がオフになる
    // Cookieの設定でresオブジェクトを扱いため、Expressライブラリを使用する必要がある。
    // この初期化とデコレーター両方使いたい場合はpassthroughをtrueにする必要がある。
    @Res({ passthrough: true }) res: Response,
  ): Promise<Msg> {
    // JWTトークンを生成する
    const jwt = await this.authService.login(dto)
    // CookieにJWTトークンを設定する
    res.cookie('access_token', jwt.accessToken, {
      // JavascriptのDocument.cookie APIを使用できなくする。そのため、XSS攻撃を防御できる
      httpOnly: true,
      // samSiteをnoneにする場合はhttpではなくhttpsで通信する必要があるためsecureをtrueにするが、POSTMANによる開発中のためfalseにする
      secure: false,
      // ChromeであるとCSRF対策でPOSTメソッドで認証してもCookieが設定できない。
      // そのため、SameSiteがデフォルトのlaxからnoneにすることでCookieが設定できるようにする
      sameSite: 'none',
      path: '/',
    })
    return {
      message: 'ok',
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Msg> {
    // アクセストークンの内容を空にする
    res.cookie('access_token', '', {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
      path: '/',
    })
    return {
      message: 'ok',
    }
  }
}
