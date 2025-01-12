import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { OrderItem } from './order.item.entity'; 

@Entity('orders')  
export class Orders {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
    items: OrderItem[];  // One order can have many order items

    @Column('decimal', { precision: 10, scale: 2 })
    totalPrice: number;

    @Column()
    userId: number; 
}
