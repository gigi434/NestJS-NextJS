import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
// passportに必要な抽象クラスをインポートする
import { PassportStrategy } from '@nestjs/passport'
// Node.jsのための認証ミドルウェアとしてpassportというライブラリをインストールする必要なライブラリから抽象クラスをインポートする
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PrismaService } from '../../prisma/prisma.service'

// PassportStrategyで宣言されているMixinStrategyクラスは抽象クラスのため拡張して宣言する。
// また、validateメソッドは抽象メソッドのため、superを用いて親のコンストラクターを呼びつつ自分で定義する
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    // StrategyOptionインターフェースで定義されているプロパティのオプションを設定する
    super({
      // fromExtractorsメソッドを用いて配列内に記載されている関数を実行し、Cookie内にあるJWTトークンが返されるまで順番に実行される
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          let jwt = null
          if (req && req.cookies) {
            jwt = req.cookies['access_token']
          }
          return jwt
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET'),
    })
  }

  /**
   * 認証が必要なAPIにアクセスした際に自動的に実行される関数オブジェクト
   * @param payload
   * @return user
   */
  async validate(payload: { sub: number; email: string }) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
    })
    delete user.hashedPassword
    // NestJSではHTTPレスポンスに自動的に返り値を付与してくれる
    return user
  }
}
