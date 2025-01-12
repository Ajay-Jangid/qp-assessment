import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grocery } from 'src/grocery/entities/grocery.entity';
import { OrderItem } from './entities/order.item.entity';
import { Orders } from './entities/order.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Orders]),
    TypeOrmModule.forFeature([Grocery]),
    TypeOrmModule.forFeature([OrderItem]),
    AuthModule
  ],
  providers: [OrderService],
  controllers: [OrderController]
})
export class OrderModule { }
