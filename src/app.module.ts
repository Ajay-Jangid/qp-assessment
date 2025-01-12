import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GroceryModule } from './grocery/grocery.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderModule } from './order/order.module';
import { UserModule } from './user/user.module';
import { Grocery } from './grocery/entities/grocery.entity';
import { Orders } from './order/entities/order.entity';
import { User } from './user/entities/user.entity';
import { OrderItem } from './order/entities/order.item.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'grocery_db',
      entities: [Grocery, Orders, User, OrderItem],
      synchronize: true,
    }),
    GroceryModule,
    OrderModule,
    UserModule,
    AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
