import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule, MongooseModule.forRoot('mongodb://localhost:27017/nest-users'), UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
