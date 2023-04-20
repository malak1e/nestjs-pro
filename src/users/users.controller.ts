import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginDto } from './users.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  async registerUser(
    @Body('name') name: string,
    @Body('password') password: string,
    @Body('email') email: string,
  ): Promise<any> {
    try {
      const user = await this.usersService.createUser(name, email, password);
      return { data: user };
    } catch (error) {
      return { Error: error.message };
    }
  }
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.usersService.login(loginDto);
    if (!user) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return user;
  }
}
