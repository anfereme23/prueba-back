// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { MailerService } from '../mailer/mailer.service';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: 'JWT_SECRET_KEY', 
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, MailerService],
  controllers: [AuthController],
  exports: [JwtAuthGuard],
})
export class AuthModule {}
