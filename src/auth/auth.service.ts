import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async getNewTokens({ refreshToken }: RefreshTokenDto) {
    if (!refreshToken) throw new UnauthorizedException('Please sign in');

    const result = await this.jwtService.verifyAsync(refreshToken);

    if (!result) throw new UnauthorizedException('Invalid token or expired');

    const user = await this.userModel.findOne();

    const tokens = this.issueTokens(String(user.id));

    return {
      ...tokens,
      user: this.returnUserFields(user),
    };
  }

  async signup(signUpDto: SignUpDto) {
    const { name, login, password, isAdmin } = signUpDto;

    const isExisted = await this.userModel.findOne({
      login,
    });

    if (isExisted) {
      throw new BadRequestException(
        `User with this login is already in the system`,
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      name,
      login,
      password: hashedPassword,
      isAdmin,
    });

    const tokens = this.issueTokens(String(user.id));

    return { ...tokens, user: this.returnUserFields(user) };
  }

  async login(loginDto: LoginDto) {
    const { login, password } = loginDto;

    const user = await this.userModel.findOne({ login });

    if (!user) {
      throw new UnauthorizedException('Invalid login or password');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid login or password');
    }

    const tokens = this.issueTokens(user.id);

    return { ...tokens, isAdmin: user.isAdmin };
  }

  async dayOff(dto: { isDayOff: boolean }): Promise<{ isDayOff: boolean }> {
    await this.userModel.updateOne({ $set: { isDayOff: dto.isDayOff } });
    const user = await this.userModel.findOne();

    return {
      isDayOff: user.isDayOff,
    };
  }

  async checkIsDayOff(): Promise<{ isDayOff: boolean }> {
    const user = await this.userModel.findOne();

    if (user) {
      return {
        isDayOff: user.isDayOff,
      };
    }
  }

  private issueTokens(userId: string) {
    const data = { id: userId };

    const accessToken = this.jwtService.sign(data, {
      expiresIn: '1h',
    });

    const refreshToken = this.jwtService.sign(data, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  returnUserFields(user: User) {
    return {
      login: user.login,
      name: user.name,
      isAdmin: user.isAdmin,
      isDayOff: user.isDayOff,
    };
  }
}
