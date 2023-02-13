import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { TodoModule } from './todo/todo.module'
import { PrismaModule } from './prisma/prisma.module'
// .envファイル内の環境変数を使用するため、ConfigModuleをインポートする
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    // ConfigModuleが各モジュールのProviderの要素を設定せずに、モジュールインポートで利用できるようにtrueに設定する
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    TodoModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
