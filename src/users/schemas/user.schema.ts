import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ required: false })
  refreshToken?: string;

  // Método para comparar contraseñas
  async comparePassword(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.password);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

// // Middleware para cifrar la contraseña antes de guardar
// UserSchema.pre<UserDocument>('save', async function (next) {
//   if (this.isModified('password')) {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//   }
//   next();
// });

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
      return next();
    }
  
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });
