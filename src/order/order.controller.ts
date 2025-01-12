import { Controller, Post, Get, Body, Request, Query, UseGuards, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { Orders } from './entities/order.entity';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { UserRole } from 'src/shared/utils/contants';
import { AuthorizationGuard } from 'src/shared/guards/authorization.guard';

@Controller('order')
@UseGuards(AuthorizationGuard)
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    @Post('place')
    async placeOrder(
        @Body('items') items: { groceryId: number; quantity: number }[],
        @Req() request: Request
    ): Promise<Orders> {
        const userId = request['user'].id // Fetch userId from request object 
        return this.orderService.placeOrder(userId, items);
    }

    @Get()
    @Roles(UserRole.Admin)
    @UseGuards(RolesGuard)
    async getAllOrders() {
        return this.orderService.getAllOrders();  // Fetch all orders
    }
}
