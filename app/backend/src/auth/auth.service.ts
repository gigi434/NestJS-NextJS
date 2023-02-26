import { Injectable, ForbiddenException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { PrismaService } from '../prisma/prisma.service'
import { AuthDto } from './dto/auth.dto'
import { Msg, Jwt } from './interfaces/auth.interface'
import { Prisma } from '@prisma/client'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}
  /**
   * サインアップ関数オブジェクト
   * @param dto Emailとパスワードをプロパティとしたクラスオブジェクト
   */
  async signUp(dto: AuthDto): Promise<Msg> {
    const hashed = await bcrypt.hash(dto.password, 12)
    try {
      await this.prisma.user.create({
        data: {
          email: dto.email,
          hashedPassword: hashed,
        },
      })
      return {
        message: 'ok',
      }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('This email is already taken')
        }
      }
      throw error
    }
  }

  async login(dto: AuthDto): Promise<Jwt> {
    // Emailを使用してユーザーが存在するか確認する
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    })
    if (!user) throw new ForbiddenException('Email or password incorrect')
    // ハッシュパスワードをDBから取得し、リクエストのパスワードと比較する
    const isValid = await bcrypt.compare(dto.password, user.hashedPassword)
    if (!isValid) throw new ForbiddenException('Email or password incorrect')

    return this.generateJwt(user.id, user.email)
  }

  /**
   * JWTトークンを生成する関数オブジェクト
   * @param userId
   * @param email
   * @return object JWTトークンを含んだオブジェクト
   */
  async generateJwt(userId: number, email: string): Promise<Jwt> {
    const payload = {
      sub: userId,
      email,
    }
    const secret = this.config.get('JWT_SECRET')
    // JWTトークンを生成する
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '5m',
      secret: secret,
    })

    return {
      accessToken: token,
    }
  }
}
