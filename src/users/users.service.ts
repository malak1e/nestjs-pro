import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './users.schema';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './users.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(
    name: string,
    email: string,
    password: string,
  ): Promise<User> {
    const hashedPass = await bcrypt.hash(password, 10);
    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      throw new Error(`User already exists!!!!!!!!!!!!!!!!!`);
    }
    const user = new this.userModel({ name, email, password: hashedPass });
    const saved = await user.save();
    return saved;
  }
  async login(loginDto: LoginDto): Promise<User | null> {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      return null; // User not found
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null; // Invalid password
    }
    return user;
  }
}
