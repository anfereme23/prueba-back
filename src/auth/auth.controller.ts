// src/auth/auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
//import { ResetPasswordDto } from './dto/reset-password.dto';


@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
async refresh(@Body() body: RefreshTokenDto) {
  return this.authService.refreshTokens(body.refresh_token);
}

@Post('forgot-password')
async forgotPassword(@Body() dto: ForgotPasswordDto) {
  await this.authService.forgotPassword(dto.email);
  return { message: 'Si el correo existe, se envió un enlace de recuperación.' };
}

// @Post('reset-password')
// async resetPassword(@Body() dto: ResetPasswordDto) {
//   return this.authService.resetPassword(dto.token, dto.newPassword);
// }

}
