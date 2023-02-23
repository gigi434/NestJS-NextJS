import { ReactNode } from 'react'
import Head from 'next/head'

type LayoutProps = {
  children: ReactNode
  title: string
}

const Layout = (props: LayoutProps) => {
  const { children, title } = props
  return (
    <div className='justigy-center flex min-h-screen flex-col items-center'>
      <Head>
        <title>{title}</title>
      </Head>
      <main className='flex w-screen flex-1 flex-col items-center justify-center'>
        {children}
      </main>
    </div>
  )
}

export default Layout
