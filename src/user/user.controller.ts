import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto } from 'src/shared/utils/contants';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    // Get all users
    @Get()
    async getAllUsers(): Promise<User[]> {
        return this.userService.findAll();
    }

    // Get user by ID
    @Get(':id')
    async getUserById(@Param('id') id: number): Promise<User> {
        return this.userService.findOne(id);
    }

    // Create a new user
    @Post()
    async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.userService.create(createUserDto);
    }

    // Update an existing user
    @Put(':id')
    async updateUser(
        @Param('id') id: number,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<User> {
        return this.userService.update(id, updateUserDto);
    }

    // Delete a user
    @Delete(':id')
    async deleteUser(@Param('id') id: number): Promise<void> {
        return this.userService.remove(id);
    }
}
