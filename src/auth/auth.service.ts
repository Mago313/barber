import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ accessToken: string }> {
    const { name, login, password } = signUpDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      name,
      login,
      password: hashedPassword,
    });
    const accessToken = this.jwtService.sign({ id: user._id });

    return { accessToken };
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ accessToken: string; name: string }> {
    const { login, password } = loginDto;

    const user = await this.userModel.findOne({ login });

    if (!user) {
      throw new UnauthorizedException('Invalid login or password');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid login or password');
    }

    const accessToken = this.jwtService.sign({ id: user._id });
    return { accessToken, name: user.name };
  }

  async dayOff(dto: { isDayOff: boolean }): Promise<{ isDayOff: boolean }> {
   await this.userModel.updateOne({ $set: { isDayOff: dto.isDayOff } });
   const user = await this.userModel.findOne();
   return {
    isDayOff: user.isDayOff
   }
  }

  async checkIsDayOff(): Promise<{ isDayOff: boolean }> {
    const user = await this.userModel.findOne();

    if (user) {
      return {
        isDayOff: user.isDayOff,
      };
    }
  }
}
