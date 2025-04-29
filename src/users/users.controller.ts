import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Usuarios') // Agrupa en Swagger
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post('CrearUsuario')
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @ApiBearerAuth()     // Añade el botón de "Authorize" para JWT
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiBearerAuth()     // Añade el botón de "Authorize" para JWT
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @ApiBearerAuth()     // Añade el botón de "Authorize" para JWT
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiBearerAuth()     // Añade el botón de "Authorize" para JWT
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

//   @UseGuards(JwtAuthGuard)
//   @ApiBearerAuth()
//   @Get('me')
//   getProfile(@Request() req) {
//      return req.user; // ← viene del JWT payload validado
//   }
}
