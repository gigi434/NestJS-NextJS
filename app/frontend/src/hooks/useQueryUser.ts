import { User } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useRouter } from 'next/router'

/**
 * ログインしているユーザー情報を取得する関数オブジェクト
 */
const useQueryUser = () => {
  const router = useRouter()

  const getUser = async () => {
    const { data } = await axios.get<Omit<User, 'hashedPassword'>>(
      `${process.env.NEXT_PUBLIC_API_BASE_PATH}/user`,
    )
    return data
  }

  return useQuery<Omit<User, 'hashedPassword'>, Error>({
    queryKey: ['user'],
    queryFn: getUser,
    onError: (err: any) => {
      // 認証されていないユーザー(JWTトークンの認証期限切れとか)がアクセスしている
      // または権限がないのに認証が必要なページにアクセスする場合はホームページに遷移する
      if (err.response.status === 401 || err.response.status === 403)
        router.push('/')
    },
  })
}

export default useQueryUser
