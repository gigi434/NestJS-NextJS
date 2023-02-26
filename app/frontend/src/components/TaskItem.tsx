import { List } from '@mantine/core'
import { PencilAltIcon, TrashIcon } from '@heroicons/react/solid'
import { Task } from '@prisma/client'
import useStore from '../store'
import useMutateTask from '@/hooks/useMutateTask'

export default function TaskItem(
  task: Omit<Task, 'createdAt' | 'updatedAt' | 'userId'>,
) {
  const update = useStore((state) => state.updateEditedTask)
  const { deleteTaskMutation } = useMutateTask()

  return (
    <List.Item>
      <div className='float-left mr-10'>
        <PencilAltIcon
          className='mx-1 h-5 w-5 cursor-pointer text-blue-500'
          onClick={() => {
            update({
              ...task,
            })
          }}
        />
        <TrashIcon
          className='h-5 w-5 cursor-pointer text-blue-500'
          onClick={() => {
            deleteTaskMutation.mutate(task.id)
          }}
        />
      </div>
      <span>{task.title}</span>
    </List.Item>
  )
}
