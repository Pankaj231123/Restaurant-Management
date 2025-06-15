import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Menu } from '../menu/menu.entity'; // Correct import
import { User } from '../users/user.entity'; // Correct import


@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Menu, (menu) => menu.orders)
  menu: Menu;

  @Column()
  quantity: number;

  @Column()
  totalPrice: number;

  @ManyToOne(() => User, (user) => user.orders)
  user: User; // Correct relation
}
