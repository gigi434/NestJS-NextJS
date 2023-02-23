import Layout from '@/components/layout'
import { LogoutIcon } from '@heroicons/react/solid'
import axios from 'axios'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React from 'react'

const Dashboard: NextPage = () => {
  const router = useRouter()
  const logout = async () => {
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
    </Layout>
  )
}

export default Dashboard

// 注意　下記はNextPageという型であるオブジェクトを返す関数オブジェクトになるため、エラーが発生する
// export default function Dashboard(): NextPage {
//   const router = useRouter()
//   const logout = async () => {
//     await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_PATH}/auth/logout`)
//     router.push('/')
//   }
//   return <Layout title='dashboard'>dashboard</Layout>
// }
