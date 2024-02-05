import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() signUpDto: SignUpDto): Promise<{ accessToken: string }> {
    return this.authService.signUp(signUpDto);
  }

  @Post('/status')
  dayOff(@Body() dto: { isDayOff: boolean }) {
    return this.authService.dayOff(dto);
  }

  @Post('/login')
  login(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
    return this.authService.login(loginDto);
  }

  @Get('/status')
  checkIsDayOff() {
    return this.authService.checkIsDayOff();
  }
}
