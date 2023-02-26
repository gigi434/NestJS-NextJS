import { FormEvent } from 'react'
import { TextInput, Button, Center } from '@mantine/core'
import { IconDatabase } from '@tabler/icons'
import useStore from '../store'
import useMutateTask from '@/hooks/useMutateTask'

export default function TaskForm() {
  const { editedTask } = useStore()
  const update = useStore((state) => state.updateEditedTask)
  const { createTaskMutation, updateTaskMutation } = useMutateTask()
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // 新規タスクを追加する場合
    if (editedTask.id === 0) {
      createTaskMutation.mutate({
        ...editedTask,
      })
    } else {
      // 既存タスクを更新する場合
      updateTaskMutation.mutate({
        ...editedTask,
      })
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        {/* タスクのタイトル入力欄 */}
        <TextInput
          mt='mt'
          placeholder='title'
          value={editedTask.title || ''}
          onChange={(e) => update({ ...editedTask, title: e.target.value })}
        />
        {/* タスクの説明入力欄 */}
        <TextInput
          mt='mt'
          placeholder='description'
          value={editedTask.description || ''}
          onChange={(e) =>
            update({ ...editedTask, description: e.target.value })
          }
        />
        <Center>
          {/* submitボタン */}
          <Button
            disabled={editedTask.title === ''}
            leftIcon={<IconDatabase size={14} />}
            color='cyan'
            type='submit'
          >
            {editedTask.id === 0 ? 'Create' : 'Update'}
          </Button>
        </Center>
      </form>
    </>
  )
}
