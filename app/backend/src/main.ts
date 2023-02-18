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
    // CORS（Cross-Origin Resource Sharing, オリジン間リソース共有）は、、従来の同一オリジンポリシーに依存するアプリケーションとの互換性を保ちながら、異なるオリジンとのデータ交換を可能にする仕組み
    // ここで、同一オリジンポリシーとはJavaScriptなどのクライアントスクリプトからサイトをまたがったアクセスを禁止するセキュリティ上の制限であり、ブラウザのサンドボックスに用意された制限の1つである
    // これにより、悪意のあるサイトを閲覧した際にJSが実行され、攻撃対象であるWebサイトへリクエストが送られてしまい、情報漏洩などの処理が行われることを防ぐ（XSSは防げないため別途対策必須）
    // しかし、近年ではAPIを叩く場合fetchを用いて異なるオリジンにリソースを要求する場合があるめ、同一オリジンポリシーを保ちつつ異なるオリジンのリソース要求が行えるようにしたのがCORSである

    // JWTトークンを埋め込んだクッキーを用いてフロントエンドとバックエンドの通信をtrueにすることで異なるオリジン(protocolからポート番号まで)でも通信が行えるようにする
    // これにより、
    credentials: true,
    // バックエンドへのアクセスを許可するフロントエンドのドメインを設定することで、このドメインから送られてくるリクエストは信頼できると言える
    origin: ['https://nextjs_container:8080'],
  })
  // フロントエンドから受け取ったクッキーを分解する
  app.use(cookieParser())
  await app.listen(3005)
}
bootstrap()
