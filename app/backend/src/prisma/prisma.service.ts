import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaClient } from '@prisma/client'

// PrismaClientを継承することでDBにアクセスするメソッドが使えるようになる
@Injectable()
export class PrismaService extends PrismaClient {
  constructor(private readonly config: ConfigService) {
    super({
      datasources: {
        db: {
          // .envファイルから環境変数を読み込む
          url: config.get('DATABASE_URL'),
        },
      },
    })
  }
}
