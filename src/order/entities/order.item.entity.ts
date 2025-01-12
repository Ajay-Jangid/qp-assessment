import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, BeforeInsert } from 'typeorm';
import { Orders } from './order.entity';
import { Grocery } from 'src/grocery/entities/grocery.entity';

@Entity('order_item')
export class OrderItem {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Orders, (order) => order.items)
    order: Orders;  // Reference to the order

    @ManyToOne(() => Grocery, (grocery) => grocery.orderItems)
    grocery: Grocery;  // Reference to the grocery item

    @Column()
    quantity: number;

    @Column('decimal', { precision: 10, scale: 2 })
    item_price: number;

    @Column('decimal', { precision: 10, scale: 2 })
    total_price: number;

    @BeforeInsert()
    setPrice() {
        // Set the price of the order item and item_price from the grocery item
        if (this.grocery && this.grocery.price) {
            this.item_price = this.grocery.price;
            this.total_price = this.item_price * this.quantity;
        }
    }
}
