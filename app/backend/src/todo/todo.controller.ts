import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express'
import { TodoService } from './todo.service'
import { CreateTaskDto } from './dto/create-task.dto'
import { UpdateTaskDto } from './dto/update-task.dto'
import { Task } from '@prisma/client'

@UseGuards(AuthGuard('jwt'))
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  async getTasks(@Req() req: Request): Promise<Task[]> {
    // strategyによるミドルウェアのvalidationメソッドの返り値であるuserオブジェクトは自動的にHTTPリクエストに含まれるため、req.user.idでユーザーIDが引数として渡せる
    return await this.todoService.getTasks(req.user.id)
  }

  @Get(':id')
  async getTaskById(
    @Req() req: Request,
    // ParseIntPipeを引数に指定することでreq.user.idをデフォルトの文字列型から数値型に変換する
    @Param('id', ParseIntPipe) taskId: number,
  ): Promise<Task> {
    return await this.todoService.getTaskById(req.user.id, taskId)
  }

  @Post()
  async createTask(
    @Req() req: Request,
    @Body() dto: CreateTaskDto,
  ): Promise<Task> {
    return await this.todoService.createTask(req.user.id, dto)
  }

  /** 単一のタスクを更新する関数オブジェクト */
  @Patch(':id')
  async updateTaskById(
    @Req() req: Request,
    @Param('id', ParseIntPipe) taskId: number,
    @Body() dto: UpdateTaskDto,
  ): Promise<Task> {
    return await this.todoService.updateTaskById(req.user.id, taskId, dto)
  }

  /** 単一のタスクを削除する関数オブジェクト */
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteTaskById(
    @Req() req: Request,
    @Param('id', ParseIntPipe) taskId: number,
  ): Promise<void> {
    return await this.todoService.deleteTaskById(req.user.id, taskId)
  }
}
