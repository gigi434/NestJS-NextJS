import { EditedTask } from '@/types'
import { Task } from '@prisma/client'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useRouter } from 'next/router'
import useStore from '../store'

export default function useMutateTask() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const reset = useStore((state) => state.resetEditedTask)

  const createTaskMutation = useMutation({
    // タスクを追加する場合はデータベース側でIDを連番として設定するためOmitユーティリティ型でidを取り除いた型を使用する
    mutationFn: async (task: Omit<EditedTask, 'id'>) => {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_PATH}/todo`,
        task,
      )
      return res.data
    },
    onSuccess: (res) => {
      // 既存のキャッシュに格納されているタスク配列オブジェクトを取得し、既存のタスク配列オブジェクトに新規タスクオブジェクトを格納することで更新する
      const previousTodos = queryClient.getQueryData<Task[]>(['tasks'])
      if (previousTodos) {
        queryClient.setQueryData(['tasks'], [res, ...previousTodos])
      }
      reset()
    },
    onError: (err: any) => {
      reset()
      if (err.response.status === 401 || err.response.status === 403) {
        router.push('/')
      }
    },
  })

  const updateTaskMutation = useMutation({
    mutationFn: async (task: EditedTask) => {
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_PATH}/todo/${task.id}`,
        task,
      )

      return res.data
    },
    onSuccess: (res, variables) => {
      // 既存のキャッシュに格納されているタスク配列オブジェクトを取得し、更新する必要のあるタスクをタスクIDから見つけ出して更新する
      const previousTodos = queryClient.getQueryData<Task[]>(['tasks'])
      if (previousTodos) {
        queryClient.setQueryData(
          ['tasks'],
          previousTodos.map((task) => (task.id === res.id ? res : task)),
        )
      }
      reset()
    },
    onError: (err: any) => {
      if (err.response.status === 401 || err.response.status === 403) {
        router.push('/')
      }
    },
  })

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_PATH}/todo/${id}`)
    },
    onSuccess: (_, variables) => {
      const previousTodos = queryClient.getQueryData<Task[]>(['tasks'])
      if (previousTodos) {
        queryClient.setQueryData(
          ['tasks'],
          previousTodos.filter((task) => task.id !== variables),
        )
      }
      reset()
    },
    onError: (err: any) => {
      reset()
      if (err.response.status === 401 || err.response.status === 403) {
        router.push('/')
      }
    },
  })

  return { createTaskMutation, updateTaskMutation, deleteTaskMutation }
}
