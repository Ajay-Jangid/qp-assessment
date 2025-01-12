import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroceryService } from './grocery.service';
import { GroceryController, GroceryUserController } from './grocery.controller';
import { Grocery } from './entities/grocery.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Grocery]),
    AuthModule
  ],
  providers: [GroceryService],
  controllers: [GroceryController, GroceryUserController],
})
export class GroceryModule { }
