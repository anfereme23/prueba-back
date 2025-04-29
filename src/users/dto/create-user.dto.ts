import { IsEmail, IsNotEmpty, MinLength, IsBoolean, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    
  @IsString()
  @IsNotEmpty({ message: 'El nombre completo es obligatorio' })
  @ApiProperty({ example: 'Juan Pérez' })
  fullName: string;

  @IsEmail({}, { message: 'Debe ser un correo electrónico válido' })
  @ApiProperty({ example: 'juan@example.com' })
  email: string;

  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @ApiProperty({ example: '123456', minLength: 6 })
  password: string;

  @IsBoolean()
  isActive?: boolean;
}
