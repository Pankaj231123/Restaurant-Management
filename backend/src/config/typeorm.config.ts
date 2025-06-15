
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { MenuModule } from 'src/menu/menu.module';
import { Menu } from 'src/menu/menu.entity';
import { Order } from 'src/order/order.entity';
import { Payment } from 'src/payment/payment.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',            
    host: '127.0.0.1',           
    port: 5432,                  
    username: 'postgres',        
    password: 'Pankaj231@',
    database: 'restaurant_db',   
    entities: [User, Menu, Order, Payment ],
    synchronize: true,          
  };
  
