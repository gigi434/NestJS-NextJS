/* 認証用のフォーム */
export type AuthForm = {
  email: string
  password: string
}

/* 編集中のタスク */
export type EditedTask = {
  id: number
  title: string
  description?: string | null
}
