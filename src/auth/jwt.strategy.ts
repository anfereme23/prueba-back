// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'JWT_SECRET_KEY', // reemplaza con tu clave segura o usa process.env.JWT_SECRET
    });
  }

  async validate(payload: any) {
    // payload contiene el objeto que firmaste en auth.service (sub, email...)
    return { userId: payload.sub, email: payload.email };
  }
}
