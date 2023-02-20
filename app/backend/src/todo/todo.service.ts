import { Injectable, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateTaskDto } from './dto/create-task.dto'
import { UpdateTaskDto } from './dto/update-task.dto'
import { Task } from '@prisma/client'

@Injectable()
export class TodoService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * ユーザーが作成したタスクだけを全て取得するメソッド
   */
  async getTasks(userId: number): Promise<Task[]> {
    return await this.prisma.task.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }
  /**
   * ユーザーが作成したタスクを一つだけ取得するメソッド
   */
  async getTaskById(userId: number, taskId: number): Promise<Task> {
    return await this.prisma.task.findFirst({
      where: {
        userId,
        id: taskId,
      },
    })
  }
  /**
   * タスクを一つ作成するメソッド
   */
  async createTask(userId: number, dto: CreateTaskDto): Promise<Task> {
    return await this.prisma.task.create({
      data: {
        userId,
        ...dto,
      },
    })
  }

  /*  */
  async updateTaskById(
    userId: number,
    taskId: number,
    dto: UpdateTaskDto,
  ): Promise<Task> {
    const task = await this.prisma.task.findUnique({
      where: {
        id: taskId,
      },
    })

    if (!task || task.userId !== userId)
      throw new ForbiddenException('No permission to update')

    return await this.prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        ...dto,
      },
    })
  }

  async deleteTaskById(userId: number, taskId: number): Promise<void> {
    const task = await this.prisma.task.findUnique({
      where: {
        id: taskId,
      },
    })

    if (!task || task.userId !== userId)
      throw new ForbiddenException('No permission to delete')

    await this.prisma.task.delete({
      where: {
        id: taskId,
      },
    })
  }
}
