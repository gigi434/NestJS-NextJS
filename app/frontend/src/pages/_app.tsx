import '@/styles/globals.css'
import { MantineProvider } from '@mantine/core'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import axios from 'axios'
import { AppProps } from 'next/app'
import React, { useEffect } from 'react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // もし `false` ならば、失敗したクエリはデフォルトで再試行されない。
      retry: false,
      // false` に設定すると、ウィンドウフォーカス時にクエリをリフェッチしない。
      refetchOnWindowFocus: false,
    },
  },
})

export default function App(props: AppProps) {
  // Cookieを利用した認証情報のやり取りでTrueにする必要がある
  axios.defaults.withCredentials = true

  // トップページを表示した際にバックエンドからCSRFトークンを取得し、これ以降の通信に使用するCSRFトークンをHTTPSリクエストヘッダに埋め込む
  useEffect(() => {
    const getCsrfToken = async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_PATH}/auth/csrf`,
      )
      axios.defaults.headers.common['csrf-token'] = data.csrfToken
    }
    getCsrfToken()
  }, [])

  const { Component, pageProps } = props

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            /** Put your mantine theme override here */
            colorScheme: 'dark',
            fontFamily: 'Verdana, sans-serif',
          }}
        >
          <Component {...pageProps} />
        </MantineProvider>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </>
  )
}
