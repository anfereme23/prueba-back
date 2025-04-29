import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import { INestApplicationContext } from '@nestjs/common';

async function bootstrap() {
  const app: INestApplicationContext = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  console.log('🚮 Eliminando usuarios existentes...');
  await usersService.deleteAll();

  console.log('🌱 Insertando usuarios de prueba...');
  await usersService.create({
    fullName: 'Usuario de prueba',
    email: 'test1@example.com',
    password: '123456', // 👈 se pasará en texto plano
    isActive: true,
  });

  await usersService.create({
    fullName: 'Otro Usuario',
    email: 'test2@example.com',
    password: '123456',
    isActive: true,
  });

  console.log('✅ Usuarios insertados con éxito');
  await app.close();
}

bootstrap();
