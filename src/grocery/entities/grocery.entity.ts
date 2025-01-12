import { OrderItem } from 'src/order/entities/order.item.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('grocery')
export class Grocery {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column()
    stock: number;

    @OneToMany(() => OrderItem, (orderItem) => orderItem.grocery)
    orderItems: OrderItem[];
}
