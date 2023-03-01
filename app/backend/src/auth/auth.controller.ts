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

  /**
   * 認証に必要なCSRFトークンを生成しCookieとしてHTTPリクエストヘッダに埋め込む関数オブジェクト
   * @param req
   */
  @Get('/csrf')
  getCsrfToken(@Req() req: Request): Csrf {
    return { csrfToken: req.csrfToken() }
  }

  // BodyデコレーターでHTTPリクエストボディに存在するデータを取得する
  @Post('signup')
  async signUp(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Msg> {
    const jwt = await this.authService.signUp(dto)
    // JWTトークンを生成する
    res.cookie('access_token', jwt.accessToken, {
      // CookieにJWTトークンを設定する
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    })
    return {
      message: 'ok',
    }
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
      // JavascriptのDocument.cookie APIを使用できなくすることで、JSによるCookieの読み取りを防ぐ
      httpOnly: true,
      // sameSiteをnoneにする場合はhttpではなくhttpsで通信しないとCookieを送信できない。
      // そのためsecureをtrueにするが、POSTMANによる開発中はhttps通信で設定する機能はないためfalseにする
      secure: true,
      // sameSiteは設定によってブラウザ, サーバー間のCookie送信をクロスサイトでも行うかの設定である。
      // eTLD+1までの違いであれば同じドメインであると認識する。
      // ChromeであるとCSRF対策でデフォルトでlaxに設定されているが、samesiteでない限りPOST, PUT, PATCH等のメソッドで認証してもCookieがリクエストで設定できないため403エラーが起きる
      // そのため、SameSiteをデフォルトのlaxからnoneにすることでCookieを設定できるようにする
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
      secure: true,
      sameSite: 'none',
      path: '/',
    })
    return {
      message: 'ok',
    }
  }
}
