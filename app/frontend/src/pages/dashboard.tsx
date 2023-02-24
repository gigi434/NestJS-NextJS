import Layout from '@/components/Layout'
import UserInfo from '@/components/UserInfo'
import { LogoutIcon } from '@heroicons/react/solid'
import axios from 'axios'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React from 'react'
import { useQueryClient } from '@tanstack/react-query'

const Dashboard: NextPage = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const logout = async () => {
    // ログアウトした後にuseQueryのキャッシュを削除する
    queryClient.removeQueries(['user'])
    await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_PATH}/auth/logout`)
    router.push('/')
  }

  return (
    <Layout title='dashboard'>
      dashboard
      <LogoutIcon
        className='mb-6 h-6 w-6 cursor-pointer text-blue-500'
        onClick={logout}
      />
      <UserInfo />
    </Layout>
  )
}

export default Dashboard

// 注意　下記はNextPageという型であるオブジェクトを返す関数オブジェクトになるため、エラーが発生する
//  Dashboard(): NextPage {
//   const router = useRouter()
//   const logout = async () => {
//     await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_PATH}/auth/logout`)
//     router.push('/')
//   }
//   return <Layout title='dashboard'>dashboard</Layout>
// }
