import type { NextPage } from 'next'
import { useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import * as Yup from 'yup'
import { IconDatabase } from '@tabler/icons'
import { ShieldCheckIcon } from '@heroicons/react/solid'
import { ExclamationCircleIcon } from '@heroicons/react/outline'
import {
  Anchor,
  TextInput,
  Button,
  Group,
  PasswordInput,
  Alert,
} from '@mantine/core'
import { useForm, yupResolver } from '@mantine/form'
import Layout from '@/components/layout'
import { AuthForm } from 'types'

// バリデーションのスキーマを定義する
const schema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('No email provided'),
  password: Yup.string()
    .required('No password provided')
    .min(5, 'Password should be min 5 chars'),
})

const Home = () => {
  const router = useRouter()
  const [isRegister, setIsRegister] = useState(false) // サインアップをするかサインインをするか切り替えるモード
  const [error, setError] = useState('')
  const form = useForm<AuthForm>({
    validate: yupResolver(schema),
    initialValues: {
      email: '',
      password: '',
    },
  })

  /**
   * サインアップまたはサインインモードの時に押されるボタンのコールバック関数
   */
  const handleSubmit = async () => {
    try {
      // サインアップモードの場合はユーザーを作成する
      if (isRegister) {
        await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_PATH}/auth/signup`),
          {
            email: form.values.email,
            password: form.values.password,
          }
      } else {
        // サインインモードの場合はサインインを行う
        await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_PATH}/auth/signin`),
          {
            email: form.values.email,
            password: form.values.password,
          }
      }
      form.reset()
      router.push('/dashboard')
    } catch (e: any) {
      setError(e.response.data.message)
    }
  }
  return (
    <>
      <Layout title='Auth'>
        <ShieldCheckIcon className='h-16 w-16 text-blue-500' />
        {/* もしリクエストに不備があり、エラーがあればエラー内容を表示する */}
        {error && (
          <Alert
            my='md'
            variant='filled'
            icon={<ExclamationCircleIcon />}
            title='Authorization Error'
            color='red'
            radius='md'
          >
            {error}
          </Alert>
        )}
        {/* useFormを使用するとpreventdefaultメソッドを実行しなくてもMantineUIが自動で実行する */}
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            mt='md'
            id='email'
            label='Email*'
            placeholder='example@gmail.com'
            // valueとonChangeはMaintineUIが自動で実行する
            {...form.getInputProps('email')}
          />
          <PasswordInput
            mt='md'
            id='password'
            placeholder='password'
            label='Password*'
            description='Must be min 5 chars'
            {...form.getInputProps('password')}
          />
          <Group mt='xl' position='apart'>
            {/* サインアップモードの場合はサインインを促す文面が表示され、ログインモードの場合はアカウント登録を促す文面を表示する */}
            <Anchor
              component='button'
              type='button'
              size='xs'
              className='text-gray-300'
              onClick={() => {
                setIsRegister(!isRegister)
                setError('')
              }}
            >
              {isRegister
                ? 'Have an account? Login'
                : "Don't have an account? Register"}
            </Anchor>
            {/* Submitボタン */}
            <Button
              leftIcon={<IconDatabase size={14} />}
              color='cyan'
              type='submit'
            >
              {isRegister ? 'Register' : 'Login'}
            </Button>
          </Group>
        </form>
      </Layout>
    </>
  )
}

export default Home
