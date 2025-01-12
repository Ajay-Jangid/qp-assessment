import { InjectRepository } from '@nestjs/typeorm';
import { Orders } from './entities/order.entity';
import { Grocery } from 'src/grocery/entities/grocery.entity';
import { Repository } from 'typeorm';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { OrderItem } from './entities/order.item.entity';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Orders)
        private readonly orderRepository: Repository<Orders>,
        @InjectRepository(OrderItem)
        private readonly orderItemRepository: Repository<OrderItem>,
        @InjectRepository(Grocery)
        private readonly groceryRepository: Repository<Grocery>,
    ) { }

    async placeOrder(userId: number, items: { groceryId: number; quantity: number }[]): Promise<Orders> {
        const orderItems = [];
        let totalPrice = 0;

        for (const { groceryId, quantity } of items) {
            const grocery = await this.groceryRepository.findOne({ where: { id: groceryId } });

            if (!grocery) {
                throw new NotFoundException(`Grocery item with ID ${groceryId} not found`);
            }

            // Check if enough stock is available
            if (grocery.stock < quantity) {
                throw new BadRequestException(`Not enough stock for ${grocery.name}`);
            }

            // Calculate price for the item in the order
            const itemPrice = grocery.price * quantity; 
            totalPrice += itemPrice;

            // Create the order item
            const orderItem = this.orderItemRepository.create({
                grocery,
                quantity
            });

            // Associate orderItem with the order (we'll set it later when saving)
            orderItems.push(orderItem);

            // Reduce stock of the grocery item
            grocery.stock -= quantity;
            await this.groceryRepository.save(grocery);
        }

        // Create the order
        const order = this.orderRepository.create({
            userId: userId,
            totalPrice,
        });

        // Save the order first
        const savedOrder = await this.orderRepository.save(order);

        // Now, associate the orderItems with the saved order
        for (const orderItem of orderItems) {
            orderItem.order = savedOrder;  // Set the order for each orderItem
        }

        // Save the order items
        await this.orderItemRepository.save(orderItems);

        return savedOrder;  
    }

    async getAllOrders(): Promise<Orders[]> {
        return this.orderRepository.find({
            relations: ['items', 'items.grocery'],  // Include related data for order items and grocery details
        });
    }
}
