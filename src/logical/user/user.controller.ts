import { Controller, Post, Body, UseGuards, UsePipes } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';
import { UserService } from './user.service';
import { ValidationPipe } from '../../pipe/validation.pipe';
import { RegisterInfoDTO } from './user.dto'; // 引入 DTO
@Controller('user')
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UserService,
  ) {}
  // JWT验证 - Step 1: 用户请求登录
  @Post('login')
  async login(@Body() loginParmas: any) {
    console.log('JWT验证 - Step 1: 用户请求登录');
    const authResult = await this.authService.validateUser(
      loginParmas.username,
      loginParmas.password,
    ); // 账号密码校验
    switch (authResult.code) {
      case 1:
        return this.authService.certificate(authResult.user);
      case 2:
        return {
          code: 600,
          msg: `账号或密码不正确`,
        };
      default:
        return {
          code: 600,
          msg: `查无此人`,
        };
    }
  }
  // @UseGuards(AuthGuard('jwt')) // 使用 'JWT' 进行验证
  @UsePipes(new ValidationPipe()) // 使用管道验证
  @Post('register')
  async register(@Body() body: RegisterInfoDTO) {
    return await this.usersService.register(body);
  }
}
