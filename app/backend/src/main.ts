import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
// Datatransfar機能の値チェックを有効化する
import { ValidationPipe } from '@nestjs/common'
// Requestのデータ型
import { Request } from 'express'
// クライアントのリクエストからcookieを取り出す
import * as cookieParser from 'cookie-parser'
// CSRF対策トークンの付与
import * as csurf from 'csurf'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  // （class-validatorライブラリを使用して）バックエンド側のバリデーションを行うためにValidationPipeが必要である
  // whitelist trueにすると、クライアントから受け取った不要な値を自動的に省く
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
  app.enableCors({
    // JWTトークンを埋め込んだクッキーを用いてフロントエンドとバックエンドの通信をtrueにすることで異なるオリジン(protocolからポート番号まで)でも通信が行えるようにする
    credentials: true,
    // バックエンドへのアクセスを許可するフロントエンドのドメインを設定する
    origin: ['https://nextjs_container:8080'],
  })
  // フロントエンドから受け取ったクッキーを分解する
  app.use(cookieParser())
  await app.listen(3005)
}
bootstrap()
