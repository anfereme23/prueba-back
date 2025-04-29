import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Crear usuario sin hash manual
  async create(createUserDto: CreateUserDto): Promise<User> {
    console.log('DTO recibido:', createUserDto); // Verificar el DTO recibido

    const createdUser = new this.userModel({
      ...createUserDto,
      isActive: true,  // Activado por defecto
    });

    console.log('Usuario creado:', createdUser);
    return createdUser.save(); // El hook pre('save') se encargará del hash aquí
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  async update(id: string, updateData: Partial<User>): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(id, updateData, { new: true });
  }

  async remove(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id);
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async updateRefreshToken(userId: string, token: string) {
    await this.userModel.findByIdAndUpdate(userId, {
      refreshToken: token,
    });
  }

  async updatePassword(userId: string, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return this.userModel.findByIdAndUpdate(userId, {
      password: hashedPassword,
    });
  }

  async deleteAll(): Promise<void> {
    await this.userModel.deleteMany({});
  }
}
