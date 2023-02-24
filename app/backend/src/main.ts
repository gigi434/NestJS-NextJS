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

  // csurfライブラリの動き
  // プロパティ名 | 説明                                  | 値例
  // _csrf        CSRFトークンを生成する時に使用する共通鍵     YiVxisTRHOEolXwzxq_wX19L
  // csrf-token   CSRFトークン                            tglAol2s-x2Za4lPXnApySjkHCeV03-OaSSs
  // access_token 認証情報を格納するJWTトークン              eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidXNlcjFAdGVzdC5jb20iLCJpYXQiOjE2NzcxOTI1OTcsImV4cCI6MTY3NzE5Mjg5N30.bEgeEwxnWeZDDttxjC5V1e_4KM0vMn58G5eltwYqDwM
  // 1. HPにアクセスすると、/auth/csrfにGETメソッドでリクエストを送られ、csurfライブラリによりHTTPリクエストヘッダに_csrfと_csrfにハッシュ関数を通したcsrf-tokenが設定される
  // 2. ログインフォームにてログインするなどしてPOST, PUT, PATCHなどのメソッドを実行しようとすると、csurfライブラリがリクエストヘッダから_csrfを取り出しハッシュ関数を通して
  // CSRFトークンを生成し、リクエストヘッダのCookieのcsrf-tokenとの検証を行う。
  // 3. 正規のCSRFトークンであるなら、登録したオリジンから送られてきたリクエストと判断する。

  // レスポンスにCSRFトークンと共通鍵をcookieに埋め込む設定を行う
  app.use(
    csurf({
      // Cookieに共通鍵を埋め込む際の設定
      cookie: {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      },
      value: (req: Request) => {
        return req.header('csrf-token')
      },
    }),
  )

  await app.listen(process.env.PORT || 3005)
}
bootstrap()
