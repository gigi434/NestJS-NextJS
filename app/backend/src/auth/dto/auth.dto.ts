// DTO(Data transfer object)とは、もともとはオブジェクト指向プログラミングで用いられるデザインパターンの一つ。
// データの受け渡し専用のクラスのことであり、このファイルではクライアントからサーバーへリクエストとして送られてくるデータのこと
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  password: string
}
