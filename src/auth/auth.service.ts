// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { MailerService } from '../mailer/mailer.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Usuario no encontrado o inactivo');
    }

    console.log('Contraseña ingresada:', password);
  console.log('Contraseña almacenada en la base de datos:', user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return user;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    const payload = { sub: user._id, email: user.email };
    const token = this.jwtService.sign(payload, {
        expiresIn: '1h',
    });

    const refresh_token = this.jwtService.sign(payload, {
        expiresIn: '7d',
        secret: 'JWT_REFRESH_SECRET',
    });

    return {
      access_token: token,
    };
  }

  async refreshTokens(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: 'JWT_REFRESH_SECRET',
      });
  
      const user = await this.usersService.findByEmail(payload.email);
      if (!user || user.refreshToken !== token) {
        throw new UnauthorizedException('Refresh token inválido');
      }
  
      const newAccessToken = this.jwtService.sign(
        { sub: user._id, email: user.email },
        { expiresIn: '1h' },
      );
  
      return { access_token: newAccessToken };
    } catch (err) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return;
  
    const token = this.jwtService.sign(
      { sub: user._id },
      {
        secret: 'JWT_RESET_SECRET',
        expiresIn: '15m',
      },
    );
    
  
     // Llama al servicio de correos
  await this.mailerService.sendPasswordReset(email, token);
  }
  
  async resetPassword(token: string, newPassword: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: 'JWT_RESET_SECRET',
      });
  
      const hashed = await bcrypt.hash(newPassword, 10);
      await this.usersService.updatePassword(payload.sub, hashed);
      return { message: 'Contraseña actualizada correctamente' };
    } catch (err) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
  
}
