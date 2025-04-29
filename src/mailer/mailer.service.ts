// src/mailer/mailer.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: 'e94fe70ebb237f',
      pass: '9d3eb52792acd1',
    },
  });

  async sendPasswordReset(email: string, token: string) {
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    await this.transporter.sendMail({
      to: email,
      from: '"Soporte" <no-reply@tuapp.com>',
      subject: 'Recuperación de contraseña',
      html: `<p>Hola,</p>
             <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
             <a href="${resetLink}">${resetLink}</a>
             <p>Este enlace expirará en 15 minutos.</p>`,
    });
  }
}
