import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { Auth } from './decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(200)
  @Post('/signup')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signup(signUpDto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('/login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login/access-token')
  getNewTokens(@Body() data: RefreshTokenDto) {
    return this.authService.getNewTokens(data);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Get('/status')
  checkIsDayOff() {
    return this.authService.checkIsDayOff();
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('/status')
  @Auth('admin')
  dayOff(@Body() dto: { isDayOff: boolean }) {
    return this.authService.dayOff(dto);
  }
}
